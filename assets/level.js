Game.Level = function(player) {
    this._entities = [player];
    this._width = 0;
    this._height = 0;
    this._generateRandomLevel(player);
};

Game.Level.prototype._generateRandomLevel = function(player) {
    var possibleDimensions = [[300, 200], [600, 400], [420, 250]];
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

    var generator = new ROT.Map.Digger(this._width, this._height, {
        roomWidth: [3, 20],
        roomHeight: [3, 15],
        corridorLength: [3, 20],
    });

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

    // Put player in random room.
    var randomRoom = rooms[ROT.RNG.getUniformInt(0, rooms.length - 1)];
    var playerX = randomRoom.getLeft() +
        Math.floor((randomRoom.getRight() - randomRoom.getLeft()) / 2);
    var playerY = randomRoom.getTop() +
        Math.floor((randomRoom.getBottom() - randomRoom.getTop()) / 2);

    player.setX(playerX);
    player.setY(playerY);

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

Game.Level.prototype.getEntities= function() {
    return this._entities;
};
