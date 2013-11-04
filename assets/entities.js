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
            console.log("Missed!");
            return;
        }

        var damageRoll = this.equipment().weapon.damroll();
        defender.hurt(damageRoll);
    },

    hurt: function(hp) {
        var damage = Math.max(0, hp - this.equipment().protectionRoll());
        this.sheet().setCurHP(this.sheet().curHP() - damage);
        console.log("Ow! I have " + this.sheet().curHP());
    }
}

// Player template
Game.PlayerTemplate = {
    glyph: new Game.Glyph({
        character: "@",
        foreground: "white",
        background: "black",
    }),
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor, Game.Mixins.Fighter]
}

Game.OrcTemplate = {
    glyph: new Game.Glyph({
        character: "o",
        foreground: "green",
        background: "black"
    }),
    mixins: [Game.Mixins.Moveable, Game.Mixins.Fighter]
}
