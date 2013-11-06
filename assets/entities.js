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
                isEnemy = other.hasMixin('Fighter');
            if (!isEnemy) return false;

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

Game.Mixins.DummyActor = {
    name: "DummyActor",
    groupName: "Actor",
    act: function() {
    }
}

Game.Mixins.Fighter = {
    name: "Fighter",
    groupName: "Fighter",
    init: function(properties) {
        properties = properties || {};
        this._sheet = properties.sheet || new Game.Sheet();
        this._equipment = properties.equipment || new Game.Equipment();
    },

    sheet: function() {
        return this._sheet;
    },

    equipment: function() {
        return this._equipment;
    },

    attack: function(defender) {
        var meleeRoll = this.sheet().melee() + Die.ndx(1, 20),
            evasionRoll = defender.sheet().evasion() + Die.ndx(1, 20);

        if (meleeRoll <= evasionRoll) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You miss the %s.".format(defender.getName()),
                "The %s misses you.".format(this.getName())
            );
        } else {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You hit the %s.".format(defender.getName()),
                "The %s hits you.".format(this.getName())
            );

            var damageRoll = this.equipment().weapon.damroll();
            defender.hurt(damageRoll, this);
        }
    },

    hurt: function(hp, attacker) {
        var damage = Math.max(0, hp - this.equipment().protectionRoll());
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
    mixins: [Game.Mixins.Moveable, Game.Mixins.DummyActor, Game.Mixins.Fighter]
}
