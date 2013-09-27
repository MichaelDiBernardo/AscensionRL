Game.Level = function() {
    this._generateRandomLevel();
};

Game.Level.prototype._generateRandomLevel = function() {
    //var possibleDimensions = [[300, 200], [600, 400], [420, 250]];
    var possibleDimensions = [[300, 200]];
    var dimensions = possibleDimensions.random();
    this._width = dimensions[0];
    this._height = dimensions[1];

    var map = [];
    for (var x = 0; x < this._width; x++) {
        // Create the nested array for the y values
        map.push([]);
        // Add all the tiles
        for (var y = 0; y < this._height; y++) {
            map[x].push(Game.Tile.wallTile);
        }
    }

    var generator = new ROT.Map.Digger(this._width, this._height);

    // Smoothen it one last time and then update our level
    generator.create(function(x, y, v) {
        if (v === 0) {
            map[x][y] = Game.Tile.floorTile;
        }
    });

    var rooms = generator.getRooms();
    for (var i = 0; i < rooms.length; i++) {
        rooms[i].getDoors(function(x, y) {
            map[x][y] = Game.Tile.doorTile;
        });
    }

    this._map = map;
};

Game.Level.prototype.getTileAt = function(x, y) {
    // Make sure we are inside the bounds. If we aren't, return
    // null tile.
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return Game.Tile.nullTile;
    } else {
        return this._map[x][y] || Game.Tile.nullTile;
    }
};

Game.Level.prototype.getWidth = function() {
    return this._width;
};

Game.Level.prototype.getHeight = function() {
    return this._height;
};
