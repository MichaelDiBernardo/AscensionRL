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
        };

        // Render the rows.
        var length = rowsData.length;
        for (var rowIndex = 0; rowIndex < length; rowIndex++) {
            var row = rowsData[rowIndex];
            var start = findStartIndex(row);
            display.drawText(1 + start, rowIndex, row);
        }
    }
};

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
            Game.Screen.playScreen.setup();
            Game.switchScreen(Game.Screen.playScreen);
        }
    }
};

Game.Screen.deathScreen = {
    enter: function() {},
    exit: function() {},
    render: function(display) {
        display.drawText(32, 11, '%c{red}%b{black}You have died.');
    }
};

/**
 * Current standin for main game screen.
 */
// Define our playing screen
Game.Screen.playScreen = {
    _level: null,
    setup: function() {
        console.log("Generating level...");
        this._player = Game.DudeRepository.create('player');
        this._level = new Game.Level(this._player);
        this._level.start();
    },
    enter: function() {
        console.log("Entered play screen.");
    },
    exit: function() {
        console.log("Exited play screen.");
        this._level.getEngine().lock();
    },
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
                var glyph = this._level.getTileAt(x, y).getGlyph();
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    glyph.getChar(),
                    glyph.getForeground(),
                    glyph.getBackground());
            }
        }

        var statusMessages =
            Game.Message.Router.getMessages(Game.Message.Channel.STATUS),
            messageY = 0;
            length = statusMessages.length;
        for (i = 0; i < length; i++) {
            var currentMessage = statusMessages[i];
            if (!currentMessage) {
                continue;
            }

            messageY += display.drawText(
                0,
                messageY,
                '%c{white}%b{black}' + statusMessages[i]
            );
        }

        var combatMessages =
            Game.Message.Router.getMessages(Game.Message.Channel.COMBAT);
            length = combatMessages.length;
        for (i = 0; i < length; i++) {
            console.log(combatMessages[i]);
        }

        Game.Message.Router.clearMessages();
    },
    move: function(dX, dY) {
        var newX = this._player.getX() + dX,
            newY = this._player.getY() + dY;
        // Try to move to the new cell
        return this._player.tryMove(newX, newY, this._level);
    },
    getItemHere: function() {
        var thisX = this._player.getX(),
            thisY = this._player.getY(),
            tile = this._level.getTileAt(thisX, thisY);

        return this._player.tryGetItemFromTile(tile);
    },
    handleInput: function(inputType, inputData) {
        // Movement
        var ok = true;
        if (inputData.keyCode === ROT.VK_LEFT || inputData.keyCode === ROT.VK_H) {
            ok = this.move(-1, 0);
        } else if (inputData.keyCode === ROT.VK_RIGHT || inputData.keyCode === ROT.VK_L) {
            ok = this.move(1, 0);
        } else if (inputData.keyCode === ROT.VK_UP || inputData.keyCode === ROT.VK_K) {
            ok = this.move(0, -1);
        } else if (inputData.keyCode === ROT.VK_DOWN || inputData.keyCode === ROT.VK_J) {
            ok = this.move(0, 1);
        } else if (inputData.keyCode === ROT.VK_G) {
            ok = this.getItemHere();
        } else if (inputData.keyCode === ROT.VK_I) {
            Game.Screen.inventoryScreen.setup(this._player);
            Game.switchScreen(Game.Screen.inventoryScreen);
        } else if (inputData.keyCode === ROT.VK_E) {
            Game.Screen.equipScreen.setup(this._player);
            Game.switchScreen(Game.Screen.equipScreen);
        } else if (inputData.keyCode === ROT.VK_W) {
            Game.Screen.wieldScreen.setup(this._player);
            Game.switchScreen(Game.Screen.wieldScreen);
        } else {
            ok = false;
        }

        // TODO: Don't use OK until you've decoupled rendering messages from
        // engine. Otherwise you won't get your msgs until next turn.
        this._level.getEngine().unlock();
    }
};

Game.Screen.inventoryScreen = {
    setup: function(player) {
        this._player = player;
        this._caption = "Inventory";
    },
    enter: function() {
    },

    exit: function() {
    },

    render: function(display) {
        var itemsMap = this._player.getInventory().getItemMap(),
            row = 2, glyph = null;
        display.drawText(0, 0, this._caption);

        _.forEach(itemsMap, function(item, slotLetter) {
            glyph = item.getGlyph();
            display.drawText(2, row, "%s)    %s".format(slotLetter, item.getOneliner()));
            display.draw(5, row,
                glyph.getChar(), glyph.getForeground(), glyph.getBackground());
            row++;
        });
    },

    handleInput: function(inputType, inputData) {
        if (inputData.keyCode === ROT.VK_ESCAPE || inputData.keyCode === ROT.VK_RETURN) {
            Game.switchScreen(Game.Screen.playScreen);
        }
    }
};

Game.Screen.wieldScreen = {
    setup: function(player) {
        this._player = player;
        this._caption = "Wield Item";
    },
    enter: function() {
    },

    exit: function() {
    },

    render: function(display) {
        var itemsMap = this._player.getInventory().getItemMap(),
            row = 2, glyph = null;
        display.drawText(0, 0, this._caption);

        _.forEach(itemsMap, function(item, slotLetter) {
            glyph = item.getGlyph();
            display.drawText(2, row, "%s)    %s".format(slotLetter, item.getOneliner()));
            display.draw(5, row,
                glyph.getChar(), glyph.getForeground(), glyph.getBackground());
            row++;
        });
    },

    handleInput: function(inputType, inputData) {
        if (inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_L) {
            this.processCommand(inputData.keyCode - ROT.VK_A);
        }
        Game.switchScreen(Game.Screen.playScreen);
    },

    processCommand: function(itemIndex) {
        var slotLetter = Utils.alphabet[itemIndex];
        this._player.equipFromSlot(slotLetter);
    }
};

Game.Screen.equipScreen = {
    setup: function(player) {
        this._player = player;
        this._caption = "Equipment";
    },
    enter: function() {
    },

    exit: function() {
    },

    render: function(display) {
        var equipment = this._player.sheet().getEquipment(),
            slots = equipment.getSlotTypes(),
            row = 2,
            // HACK
            chars = Utils.alphabet,
            slotLetter = null,
            equip = null;

        display.drawText(0, 0, this._caption);

        _.forEach(slots, function(slot) {
            equip = equipment.getWearableInSlot(slot);
            glyph = equip.getGlyph();
            slotLetter = chars[row-2];
            display.drawText(2, row, "%s)    %s".format(slotLetter, equip.getOneliner()));
            display.draw(5, row,
                glyph.getChar(), glyph.getForeground(), glyph.getBackground());
            row++;
        });
    },

    handleInput: function(inputType, inputData) {
        if (inputData.keyCode === ROT.VK_ESCAPE || inputData.keyCode === ROT.VK_RETURN) {
            Game.switchScreen(Game.Screen.playScreen);
        }
    }
};
