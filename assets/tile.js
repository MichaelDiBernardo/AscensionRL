Game.Tile = function(properties) {
    properties = properties || {};
    this._isWalkable = properties.isWalkable || false;
    this._isDiggable = properties.isDiggable || false;
    this._isOccupied = false;
    this._glyph = properties.glyph || Game.Glyph.NullGlyph;
};

Game.Tile.prototype.isWalkable = function() {
    return this._isWalkable && !this._isOccupied;
}
Game.Tile.prototype.isDiggable = function() {
    return this._isDiggable;
}
Game.Tile.prototype.setOccupied = function(state) {
    this._isOccupied = state;
}
Game.Tile.prototype.getGlyph = function() {
    return this._glyph;
}

// TODO: This will disappear when map templates declare their own tile
// templates.
Game.Tile.Tiles = {
    NULL: "Null",
    FLOOR: "Floor",
    DOOR: "Door",
    WALL: "Wall"
};

Game.Tile.create = function(kind) {
    switch (kind) {
        case Game.Tile.Tiles.WALL:
            return new Game.Tile({
                glyph: new Game.Glyph({
                    character: "#",
                    foreground: "goldenrod",
                }),
                isDiggable: true
            });
        case Game.Tile.Tiles.FLOOR:
            return new Game.Tile({
                glyph: new Game.Glyph({
                    character: "."
                }),
                isWalkable: true
            });
        case Game.Tile.Tiles.DOOR:
            return new Game.Tile({
                glyph: new Game.Glyph({
                    character: "+",
                    foreground: "red"
                }),
                isWalkable: true
            })
        default:
            return new Game.Tile();
    }
}
