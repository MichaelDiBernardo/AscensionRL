Game.Tile = function(properties) {
    properties = properties || {};
    this._isWalkable = properties.isWalkable || false;
    this._isOpaque = properties.isOpaque || false;
    this._occupant = null;
    this._inventory = new Game.Inventory({ capacity: 32 });
    this._glyph = properties.glyph || Game.Glyph.NullGlyph;
};

Game.Tile.prototype.isWalkable = function() {
    return this._isWalkable && !this.isOccupied();
};

Game.Tile.prototype.isOpaque = function() {
    return this._isOpaque;
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

Game.Tile.prototype.removeTopItem = function() {
    return this._inventory.removeItemBySlot("a");
};

Game.Tile.prototype.getItemStack = function() {
    return this._inventory;
};

Game.Tile.prototype.hasMultipleItems = function() {
    return this._inventory.itemCount() > 1;
};

Game.Tile.prototype.getGlyph = function() {
    if (this._occupant) {
        return this.getOccupant().getGlyph();
    }

    var itemCount = this._inventory.itemCount();

    if (itemCount === 0) {
        return this._glyph;
    }
    else if (itemCount === 1) {
        return this._inventory.getFirstItem().getGlyph();
    } else {
        return this._inventory.getFirstItem().getGlyph().withBackground("#444");
    }
    throw new Error("No glyph possible!");
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
                isOpaque: true
            });
        case Game.Tile.Tiles.FLOOR:
            return new Game.Tile({
                glyph: new Game.Glyph({
                    character: ".",
                    foreground: "grey"
                }),
                isWalkable: true,
                isOpaque: false
            });
        case Game.Tile.Tiles.DOOR:
            return new Game.Tile({
                glyph: new Game.Glyph({
                    character: "+",
                    foreground: "red"
                }),
                isWalkable: true,
                isOpaque: true
            });
        default:
            return new Game.Tile();
    }
};
