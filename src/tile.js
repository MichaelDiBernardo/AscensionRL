Game.Tile = function(properties) {
    properties = properties || {};
    this._isWalkable = properties.isWalkable || false;
    this._isDiggable = properties.isDiggable || false;
    this._occupant = null;
    this._inventory = new Game.Inventory({ capacity: 32 });
    this._glyph = properties.glyph || Game.Glyph.NullGlyph;
};

Game.Tile.prototype.isWalkable = function() {
    return this._isWalkable && !this.isOccupied();
};

Game.Tile.prototype.isDiggable = function() {
    return this._isDiggable;
};

Game.Tile.prototype.onEntityEntered = function(entity) {
    this._occupant = entity;
};

Game.Tile.prototype.onEntityExited = function(entity) {
    this._occupant = null;
};

Game.Tile.prototype.getOccupant = function() {
    return this._occupant;
};

Game.Tile.prototype.isOccupied = function() {
    if (this._occupant) {
        return true;
    }

    return false;
};

Game.Tile.prototype.placeItem = function(item) {
    this._inventory.addItem(item);
};

Game.Tile.prototype.getTopItem = function() {
    if (this._inventory.itemCount()) {
        return this._inventory.getItemBySlot("a");
    } else {
        return null;
    }
};

Game.Tile.prototype.removeTopItem = function() {
    return this._inventory.removeItemBySlot("a");
};

Game.Tile.prototype.getGlyph = function() {
    if (this._occupant) {
        return this.getOccupant().getGlyph();
    }

    if (this._inventory.itemCount()) {
        return this._inventory.getFirstItem().getGlyph();
    }

    return this._glyph;
};

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
                    character: ".",
                    foreground: "grey"
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
            });
        default:
            return new Game.Tile();
    }
};
