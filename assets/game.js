/**
 * Main game executor. This is currently stolen from about midway through (Part
 * 8ish?) the tutorials found here:
 *
 * http://www.codingcookies.com/category/roguelikes/
 */
var Game = {
    _display: null,
    _currentScreen: null,
    _screenWidth: 80,
    _screenHeight: 24,

    init: function() {
        this._display = new ROT.Display({
            width:this._screenWidth, height:this._screenHeight
        });

        var self = this;
        var bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is received, send it to the
                // screen if there is one
                if (self._currentScreen !== null) {
                    // Send the event type and data to the screen
                    self._currentScreen.handleInput(event, e);
                }
            });
        }
        // Bind keyboard input events
        bindEventToScreen('keydown');
    },

    refresh: function() {
        this._display.clear();
        this._currentScreen.render(this._display);
    },

    getDisplay: function() {
        return this._display;
    },

    switchScreen: function(screen) {
        // If we had a screen before, notify it that we exited
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }

        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this.refresh();
        }
    },
    getDisplay: function() {
        return this._display;
    },
    getScreenWidth: function() {
        return this._screenWidth;
    },
    getScreenHeight: function() {
        return this._screenHeight;
    }
};

window.onload = function() {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();
        Game.switchScreen(Game.Screen.startScreen);
        // Add the container to our HTML page
        document.body.appendChild(Game.getDisplay().getContainer());
    }
}
