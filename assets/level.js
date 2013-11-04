Game.Level = function(player) {
    this._entities = [];
    this._width = 0;
    this._height = 0;
    this._map = null;
    this._scheduler = new ROT.Scheduler.Simple();
    this._engine = new ROT.Engine(this._scheduler);
    this._generateRandomLevel(player);
    this._placeMonsters();
}

Game.Level.prototype.getTileAt = function(x, y) {
    // Make sure we are inside the bounds. If we aren"t, return
    // null tile.
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return Game.Tile.nullTile;
    } else {
        return this._map[x][y] || Game.Tile.nullTile;
    }
}

Game.Level.prototype.getWidth = function() {
    return this._width;
}

Game.Level.prototype.getHeight = function() {
    return this._height;
}

Game.Level.prototype.getEngine = function() {
    return this._engine;
}

Game.Level.prototype.getEntities = function() {
    return this._entities;
}

Game.Level.prototype.start = function() {
    this._engine.start();
}

Game.Level.prototype.placeEntityAt = function(entity, x, y) {
    entity.setX(x);
    entity.setY(y);
    entity.setLevel(this);
    this._entities.push(entity);
    if (entity.hasMixin('Actor')) {
        this._scheduler.add(entity, true);
    }
    this.getTileAt(x, y).onEntityEntered(entity);
}

Game.Level.prototype.placeAtRandomSquare = function(entity) {
    while (true) {
        var randomX = ROT.RNG.getUniformInt(0, this.getWidth() - 1),
            randomY = ROT.RNG.getUniformInt(0, this.getHeight() - 1),
            tile = this.getTileAt(randomX, randomY),
            isFree = tile.isWalkable();

        if (!isFree) {
            continue;
        }

        this.placeEntityAt(entity, randomX, randomY);
        return;
    }
}

// TODO: This should return its generator or keep a list of rooms so that
// the player placement routine can be done independently.
Game.Level.prototype._generateRandomLevel = function(player) {
    var possibleDimensions = [[300, 200], [600, 400], [420, 250]],
        dimensions = possibleDimensions.random();
    this._width = dimensions[0];
    this._height = dimensions[1];

    var map = [],
        // Wall tiles don't really need extra state, so we just use one.
        wallTile = Game.Tile.create(Game.Tile.Tiles.WALL);

    for (var x = 0; x < this._width; x++) {
        map.push([]);
        for (var y = 0; y < this._height; y++) {
            map[x].push(wallTile);
        }
    }

    var generator = new ROT.Map.Digger(this._width, this._height, {
        roomWidth: [3, 20],
        roomHeight: [3, 15],
        corridorLength: [3, 20],
    });

    generator.create(function(x, y, v) {
        if (v === 0) {
            map[x][y] = Game.Tile.create(Game.Tile.Tiles.FLOOR);
        }
    });

    var rooms = generator.getRooms(),
        length = rooms.length;
    for (var i = 0; i < length; i++) {
        rooms[i].getDoors(function(x, y) {
            map[x][y] = Game.Tile.create(Game.Tile.Tiles.DOOR);
        });
    }

    // Map is done!
    this._map = map;

    // Put player in random room.
    var randomRoom = rooms[ROT.RNG.getUniformInt(0, rooms.length - 1)],
        playerX = randomRoom.getLeft() +
            Math.floor((randomRoom.getRight() - randomRoom.getLeft()) / 2),
        playerY = randomRoom.getTop() +
            Math.floor((randomRoom.getBottom() - randomRoom.getTop()) / 2);

    this.placeEntityAt(player, playerX, playerY);
}

Game.Level.prototype._placeMonsters = function() {
    var monsterCount = ROT.RNG.getUniformInt(15, 30);
    for (var i = 0; i < monsterCount; i++) {
        var newMonster = new Game.Entity(Game.OrcTemplate);
        this.placeAtRandomSquare(newMonster);
    }
}
