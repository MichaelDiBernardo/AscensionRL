Game.Tile = function(properties) {
    properties = properties || {};
    this._isWalkable = properties['isWalkable'] || false;
    this._isDiggable = properties['isDiggable'] || false;
    this._glyph = properties['glyph'] || Game.Glyph.NullGlyph;
};

Game.Tile.prototype.isWalkable = function() {
    return this._isWalkable;
}
Game.Tile.prototype.isDiggable = function() {
    return this._isDiggable;
}
Game.Tile.prototype.getGlyph = function() {
    return this._glyph;
}

Game.Tile.nullTile = new Game.Tile();
Game.Tile.floorTile = new Game.Tile({
    glyph: new Game.Glyph({
        character: '.'
    }),
    isWalkable: true
});
Game.Tile.doorTile = new Game.Tile({
    glyph: new Game.Glyph({
        character: '+',
        foreground: 'red'
    }),
    isWalkable: true
});
Game.Tile.wallTile = new Game.Tile({
    glyph: new Game.Glyph({
        character: '#',
        foreground: 'goldenrod',
    }),
    isDiggable: true
});
