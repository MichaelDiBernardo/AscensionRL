Game.Screen = {};

Game.Screen.Renderer = {};

/**
 * A renderer that will take a row of strings and render them to the screen.
 */
Game.Screen.Renderer.splashScreenRenderer = {
    /**
     * Renders the given screen data (an array of string "rows") to the screen.
     * rot.js will trim leading whitespace using drawText, whereas this will
     * honor it; thus, it is safe to use %c{} tags after leading whitespace to
     * do color changes etc.
     */
    render: function(display, rowsData) {
        // Helper function to find the actual start point of a line that begins
        // with leading whitespace.
        var findStartIndex = function(line) {
            var startIndex = 0,
                length = line.length;
            while (startIndex < length && line[startIndex] == " ") {
                startIndex++;
            }
            return startIndex;
        }

        // Render the rows.
        var length = rowsData.length;
        for (var rowIndex = 0; rowIndex < length; rowIndex++) {
            var row = rowsData[rowIndex];
            var start = findStartIndex(row);
            display.drawText(1 + start, rowIndex, row);
        }
    }
}

/**
 * The title screen.
 */
Game.Screen.startScreen = {
    enter: function() {},
    exit: function() {},
    render: function(display) {
        var introScreenData = Game.SplashScreenLoader.loadFromUrl(
                "lib/screens/title.scr"
        );
        Game.Screen.Renderer.splashScreenRenderer.render(display,
                introScreenData);
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputData.keyCode === ROT.VK_RETURN) {
            Game.switchScreen(Game.Screen.playScreen);
        }
    }
}

/**
 * Current standin for main game screen.
 */
// Define our playing screen
Game.Screen.playScreen = {
    _level: null,
    enter: function() {
        console.log("Entered play screen.");
        console.log("Generating level...");


        // Create our level from the tiles
        this._player = new Game.Entity(Game.PlayerTemplate);
        this._level = new Game.Level(this._player);
        this._level.start();
    },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        // Make sure the x-axis doesn"t go to the left of the left bound
        var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._level.getWidth() - screenWidth);
        // Make sure the y-axis doesn"t above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._level.getHeight() - screenHeight);

        // Iterate through all visible level cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                var tile = this._level.getTileAt(x, y);
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    tile.getGlyph().getChar(),
                    tile.getGlyph().getForeground(),
                    tile.getGlyph().getBackground());
            }
        }

        // Render the entities
        var entities = this._level.getEntities(),
            length = entities.length;
        for (var i = 0; i < length; i++) {
            var entity = entities[i];
            // Only render the entity if they would show up on the screen
            if (entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
                entity.getX() < topLeftX + screenWidth &&
                entity.getY() < topLeftY + screenHeight) {
                display.draw(
                    entity.getX() - topLeftX,
                    entity.getY() - topLeftY,
                    entity.getGlyph().getChar(),
                    entity.getGlyph().getForeground(),
                    entity.getGlyph().getBackground()
                );
            }
        }

        var statusMessages =
            Game.Message.Router.getMessages(Game.Message.Channel.STATUS),
            length = statusMessages.length,
            messageY = 0;
        for (var i = 0; i < length; i++) {
            messageY += display.drawText(
                0,
                messageY,
                '%c{white}%b{black}' + statusMessages[i]
            );
        }
        Game.Message.Router.clearMessages();
    },
    move: function(dX, dY) {
        var newX = this._player.getX() + dX,
            newY = this._player.getY() + dY;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, this._level);
    },
    handleInput: function(inputType, inputData) {
        // Movement
        if (inputData.keyCode === ROT.VK_LEFT) {
            this.move(-1, 0);
        } else if (inputData.keyCode === ROT.VK_RIGHT) {
            this.move(1, 0);
        } else if (inputData.keyCode === ROT.VK_UP) {
            this.move(0, -1);
        } else if (inputData.keyCode === ROT.VK_DOWN) {
            this.move(0, 1);
        }
        this._level.getEngine().unlock();
    }
}
