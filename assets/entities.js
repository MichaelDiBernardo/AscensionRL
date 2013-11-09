// Create our Mixins namespace
Game.Mixins = {};

// Define our Moveable mixin
Game.Mixins.Moveable = {
    name: "Moveable",
    groupName: "Moveable",
    tryMove: function(x, y, map) {
        var currentTile = map.getTileAt(this._x, this._y),
            targetTile = map.getTileAt(x, y);

        // Should we hit something?
        if (targetTile.isOccupied()) {
            // We don't bother checking if this is also fighter, because
            // nothing moves that doesn't also attack so far.
            var other = targetTile.getOccupant(),
                isAttackable = other.hasMixin('Fighter'),
                areOpposed = other.hasMixin('PlayerActor') || this.hasMixin('PlayerActor');
            if (!isAttackable || !areOpposed) return false;

            this.attack(other);
            return false;
        }

        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (targetTile.isWalkable()) {
            // Update the entity's position
            this._x = x;
            this._y = y;
            currentTile.onEntityExited(this);
            targetTile.onEntityEntered(this);
            return true;
        }

        Game.Message.Router.selectMessage(
            Game.Message.Channel.STATUS,
            this,
            "There is a wall in the way!",
            ""
        );
        return false;
    }
}

Game.Mixins.PlayerActor = {
    name: "PlayerActor",
    groupName: "Actor",
    act: function() {
        Game.refresh();
        // Lock the engine and wait asynchronously for the player to press
        // a key.
        this.getLevel().getEngine().lock();
    }
}

Game.Mixins.WanderingActor = {
    name: "WanderingActor",
    groupName: "Actor",
    act: function() {
        this.wander();
    },
    wander: function() {
        var xDelta = [1, 0, -1].random(),
            yDelta = [1, 0, -1].random(),
            newX = this.getX() + xDelta,
            newY = this.getY() + yDelta;

        if (xDelta == yDelta == 0) {
            this.wander();
        } else {
            this.tryMove(newX, newY, this.getLevel());
        }
    }
}

Game.Mixins.Fighter = {
    name: "Fighter",
    groupName: "Fighter",
    init: function(properties) {
        properties = properties || {};
        this._sheet = properties.sheet || new Game.Sheet();
    },

    sheet: function() {
        return this._sheet;
    },

    attack: function(defender) {
        var meleeRoll = this.sheet().melee() + Die.ndx(1, 20),
            evasionRoll = defender.sheet().evasion() + Die.ndx(1, 20),
            residual = meleeRoll - evasionRoll,
            accumulator = new Game.Message.CombatRollAccumulator({
                attacker: this,
                defender: defender,
                meleeRoll: meleeRoll,
                evasionRoll: evasionRoll
            });


        if (residual <= 0) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You miss the %s.".format(defender.getName()),
                "The %s misses you.".format(this.getName())
            );
            accumulator.hit = false;
        } else {
            accumulator.hit = true;

            var damageRoll = this.sheet().damroll(residual, accumulator),
                critSuffix = accumulator.buildCritSuffix();
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You hit the %s%s".format(defender.getName(), critSuffix),
                "The %s hits you%s".format(this.getName(), critSuffix)
            );
            defender.hurt(damageRoll, this, accumulator);
        }
        Game.Message.Router.sendMessage(
            Game.Message.Channel.COMBAT,
            accumulator.buildCombatRollMessage()
        );
    },

    hurt: function(hp, attacker, accumulator) {
        var protectionRoll = this.sheet().protectionRoll(),
            damage = Math.max(0, hp - protectionRoll);
        accumulator.protectionRoll = protectionRoll;
        accumulator.damage = damage;

        this.sheet().setCurHP(this.sheet().curHP() - damage);
        if (this.sheet().curHP() <= 0) {
            this.onDeath(attacker);
        }
    },

    // TODO: There are enough of these now that we should just have a generic
    // event raising thing that other classes can extend.
    onDeath: function(killer) {
        if (killer) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You die.",
                "You have slain the %s.".format(this.getName())
            );
        } else {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You die.",
                "It dies."
            );
        }
        this.getLevel().removeEntity(this);
        if (this.hasMixin("PlayerActor")) {
            Game.switchScreen(Game.Screen.deathScreen);
        }
    }
}

// Player template
Game.PlayerTemplate = {
    glyph: new Game.Glyph({
        character: "@",
        foreground: "white",
        background: "black",
    }),
    name: "Player",
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor, Game.Mixins.Fighter]
}

Game.OrcTemplate = {
    glyph: new Game.Glyph({
        character: "o",
        foreground: "green",
        background: "black"
    }),
    name: "Orc",
    mixins: [Game.Mixins.Moveable, Game.Mixins.WanderingActor, Game.Mixins.Fighter]
}
