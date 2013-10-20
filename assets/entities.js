// Create our Mixins namespace
Game.Mixins = {};

// Define our Moveable mixin
Game.Mixins.Moveable = {
    name: 'Moveable',
    groupName: 'Moveable',
    tryMove: function(x, y, map) {
        var tile = map.getTileAt(x, y);
        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (tile.isWalkable()) {
            // Update the entity's position
            this._x = x;
            this._y = y;
            return true;
        }
        return false;
    }
}

Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
    }
}

Game.Mixins.Fighter = {
    name: 'Fighter',
    groupName: 'Fighter',
    init: function(properties) {
        this._curHP = properties.curHP || 1;
        this._maxHP = properties.maxHP || 1;
    },

    curHP: function() {
        return this._curHP;
    },

    attack: function(defender) {
        defender._curHP -= 1;
    },
}

// Player template
Game.PlayerTemplate = {
    glyph: new Game.Glyph({
        character: '@',
        foreground: 'white',
        background: 'black',
    }),
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor]
}
