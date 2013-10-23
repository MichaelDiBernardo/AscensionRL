// Create our Mixins namespace
Game.Mixins = {};

// Define our Moveable mixin
Game.Mixins.Moveable = {
    name: "Moveable",
    groupName: "Moveable",
    tryMove: function(x, y, map) {
        var tile = map.getTileAt(x, y);
        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (tile.isWalkable()) {
            // Update the entity"s position
            this._x = x;
            this._y = y;
            return true;
        }
        return false;
    }
}

Game.Mixins.PlayerActor = {
    name: "PlayerActor",
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
            return;
        }

        var damageRoll = this.equipment().weapon.damroll();
        defender.hurt(damageRoll);
    },

    hurt: function(hp) {
        this.sheet().setCurHP(this.sheet().curHP() - hp);
    }
}

// Player template
Game.PlayerTemplate = {
    glyph: new Game.Glyph({
        character: "@",
        foreground: "white",
        background: "black",
    }),
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor]
}
