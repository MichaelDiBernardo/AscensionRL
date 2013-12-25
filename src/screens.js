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
        var level = this._level;
        this._fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
            return !level.getTileAt(x, y).isOpaque();
        });
    },

    enter: function() {
        console.log("Entered play screen.");
    },

    exit: function() {
        console.log("Exited play screen.");
        this._level.getEngine().lock();
    },

    render: function(display) {
        this._renderMap(display);
        this._renderHUD(display);
        this._renderMessages(display);
    },

    _renderMap: function(display) {
        var visibleCells = {};
        this._fov.compute(
            this._player.getX(), this._player.getY(), 4,
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = visibility;
            }
        );

        // Make sure the x-axis doesn"t go to the left of the left bound
        var topLeftX = Math.max(UI_HUD_WIDTH, this._player.getX() - (UI_SCREEN_WIDTH / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._level.getWidth() - UI_SCREEN_WIDTH);
        // Make sure the y-axis doesn"t above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (UI_SCREEN_HEIGHT / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._level.getHeight() - UI_SCREEN_HEIGHT);

        // Iterate through all visible level cells
        for (var x = topLeftX; x < topLeftX + UI_SCREEN_WIDTH; x++) {
            for (var y = topLeftY; y < topLeftY + UI_SCREEN_HEIGHT; y++) {
                var cellVisValue = visibleCells[x + "," + y],
                    isDark = cellVisValue === undefined || cellVisValue <= 0;

                if (isDark) {
                    continue;
                }

                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                var glyph = this._level.getTileAt(x, y).getGlyph();
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    glyph.getChar(),
                    glyph.getForeground(),
                    glyph.getBackground()
                );
            }
        }
    },

    _renderHUD: function(display) {
        // Iterate through all visible level cells
        for (var x = 0; x < UI_HUD_WIDTH; x++) {
            for (var y = 0; y < UI_SCREEN_HEIGHT; y++) {
                display.draw(
                    x, y, " ", "black", "black"
                );
            }
        }

        var sheet = this._player.sheet();
        display.drawText(0, 1,
            "%c{blue}%b{black}" + this._player.getName());

        display.drawText(0, 3,
            "%c{white}%b{black}Str   %c{green}" + sheet.str());
        display.drawText(0, 4,
            "%c{white}%b{black}Dex   %c{green}" + sheet.dex());
        display.drawText(0, 5,
            "%c{white}%b{black}Con   %c{green}" + sheet.con());
        display.drawText(0, 6,
            "%c{white}%b{black}Gra   %c{green}" + sheet.gra());

        display.drawText(0, 8,
            "%c{white}%b{black}HP    %c{green}" + sheet.curHP() + "/" + sheet.maxHP());


        var damroll = sheet.damroll(0),
            attackSummary = sprintf("(%+d,%s)", sheet.melee(), damroll.toString()),
            protroll = sheet.protectionRoll(),
            defenseSummary = sprintf("[%+d,%s]", sheet.evasion(), protroll.toString());
        display.drawText(3, 10,
            "%c{white}%b{black}" + attackSummary);
        display.drawText(3, 12,
            "%c{white}%b{black}" + defenseSummary);

    },

    _renderMessages: function(display) {
        var statusMessages =
            Game.Message.Router.getMessages(Game.Message.Channel.STATUS),
            messageY = 0,
            length = statusMessages.length,
            i;

        for (i = 0; i < length; i++) {
            var currentMessage = statusMessages[i];
            if (!currentMessage) {
                continue;
            }

            messageY += display.drawText(
                UI_HUD_WIDTH,
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

    handleGetFromFloor: function() {
        if (this._player.getTileBeneath().hasMultipleItems()) {
            Game.Screen.getFromFloorScreen.setup(this._player);
            Game.switchScreen(Game.Screen.getFromFloorScreen);
        } else {
            this._player.getItemOnFloor();
        }
    },

    handleInput: function(inputType, inputData) {
        // Movement
        var ok = true,
            kc = inputData.keyCode;
        if (kc === ROT.VK_LEFT || kc === ROT.VK_H) {
            ok = this.move(-1, 0);
        } else if (kc === ROT.VK_RIGHT || kc === ROT.VK_L) {
            ok = this.move(1, 0);
        } else if (kc === ROT.VK_UP || kc === ROT.VK_K) {
            ok = this.move(0, -1);
        } else if (kc === ROT.VK_DOWN || kc === ROT.VK_J) {
            ok = this.move(0, 1);
        } else if (kc === ROT.VK_G) {
            ok = this.handleGetFromFloor();
        } else if (kc === ROT.VK_I) {
            Game.Screen.inventoryScreen.setup(this._player);
            Game.switchScreen(Game.Screen.inventoryScreen);
        } else if (kc === ROT.VK_E) {
            Game.Screen.equipScreen.setup(this._player);
            Game.switchScreen(Game.Screen.equipScreen);
        } else if (kc === ROT.VK_D) {
            Game.Screen.dropScreen.setup(this._player);
            Game.switchScreen(Game.Screen.dropScreen);
        } else if (kc === ROT.VK_W) {
            Game.Screen.wieldScreen.setup(this._player);
            Game.switchScreen(Game.Screen.wieldScreen);
        } else if (kc === ROT.VK_R) {
            Game.Screen.unwieldScreen.setup(this._player);
            Game.switchScreen(Game.Screen.unwieldScreen);
        } else {
            ok = false;
        }

        // TODO: Don't use OK until you've decoupled rendering messages from
        // engine. Otherwise you won't get your msgs until next turn.
        this._level.getEngine().unlock();
    }
};

/**
 * Base screen type for equipment and item menus.
 */
Game.Screen.ItemMenuScreen = function(properties) {
    this.render = properties.renderer;
    this.selectContainer = properties.containerSelector;
    this.onSlotSelection = properties.onSlotSelection || Utils.IdentityFunc;
    this._caption = properties.caption;
};

Game.Screen.ItemMenuScreen.prototype.setup = function(player) {
    this._player = player;
};

Game.Screen.ItemMenuScreen.prototype.enter = function() {
};

Game.Screen.ItemMenuScreen.prototype.exit = function() {
};

Game.Screen.ItemMenuScreen.prototype.handleInput = function(inputType, inputData) {
    var kc = inputData.keyCode,
        isNotCloseCommand = kc !== ROT.VK_ESCAPE && kc !== ROT.VK_RETURN,
        isGoodSlotSelection = kc >= ROT.VK_A && kc <= ROT.VK_L;

    if (isNotCloseCommand && isGoodSlotSelection) {
        var itemIndex = kc - ROT.VK_A,
            slotLetter = Utils.alphabet[itemIndex];

        this.onSlotSelection(slotLetter);
    }

    Game.switchScreen(Game.Screen.playScreen);
};


/**
 * Base renderers for configuring item screens.
 */
Game.Screen.Renderer.inventoryItemRenderer = function(display) {
    var itemsMap = this.selectContainer().getItemMap(),
        row = 2, glyph = null;
    display.drawText(0, 0, this._caption);

    _.forEach(itemsMap, function(item, slotLetter) {
        glyph = item.getGlyph();
        display.drawText(2, row, "%s)    %s".format(slotLetter, item.getOneliner()));
        display.draw(5, row,
            glyph.getChar(), glyph.getForeground(), glyph.getBackground());
        row++;
    });
};

Game.Screen.Renderer.equipmentItemRenderer = function(display) {
    var equipment = this.selectContainer(),
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
};

/**
 * Container selectors (i.e. picking which container of things to render.)
 */
Game.Screen.ItemMenuScreen.inventorySelector = function() {
    return this._player.getInventory();
};

Game.Screen.ItemMenuScreen.equipmentSelector = function() {
    return this._player.sheet().getEquipment();
};

Game.Screen.ItemMenuScreen.floorStackSelector = function() {
    return this._player.getTileBeneath().getItemStack();
};

/**
 * Item screen definitions.
 */
Game.Screen.inventoryScreen = new Game.Screen.ItemMenuScreen({
    renderer: Game.Screen.Renderer.inventoryItemRenderer,
    containerSelector: Game.Screen.ItemMenuScreen.inventorySelector,
    caption: "Inventory"
});

Game.Screen.dropScreen = new Game.Screen.ItemMenuScreen({
    renderer: Game.Screen.Renderer.inventoryItemRenderer,
    containerSelector: Game.Screen.ItemMenuScreen.inventorySelector,
    onSlotSelection: function(slotLetter) {
        this._player.dropItemOnFloor(slotLetter);
    },
    caption: "Drop Item"
});

Game.Screen.wieldScreen = new Game.Screen.ItemMenuScreen({
    renderer: Game.Screen.Renderer.inventoryItemRenderer,
    containerSelector: Game.Screen.ItemMenuScreen.inventorySelector,
    onSlotSelection: function(slotLetter) {
        this._player.equipFromSlot(slotLetter);
    },
    caption: "Wield Item"
});

Game.Screen.unwieldScreen = new Game.Screen.ItemMenuScreen({
    renderer: Game.Screen.Renderer.equipmentItemRenderer,
    containerSelector: Game.Screen.ItemMenuScreen.equipmentSelector,
    onSlotSelection: function(slotLetter) {
        this._player.unequipFromSlot(slotLetter);
    },
    caption: "Unwield Item"
});

Game.Screen.equipScreen = new Game.Screen.ItemMenuScreen({
    renderer: Game.Screen.Renderer.equipmentItemRenderer,
    containerSelector: Game.Screen.ItemMenuScreen.equipmentSelector,
    caption: "Equipment"
});

Game.Screen.getFromFloorScreen = new Game.Screen.ItemMenuScreen({
    renderer: Game.Screen.Renderer.inventoryItemRenderer,
    containerSelector: Game.Screen.ItemMenuScreen.floorStackSelector,
    onSlotSelection: function(slotLetter) {
        this._player.getItemOnFloor(slotLetter);
    },
    caption: "On Floor"
});
