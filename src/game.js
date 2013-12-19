/**
 * Main game executor. This is currently stolen from about midway through (Part
 * 8ish?) the tutorials found here:
 *
 * http://www.codingcookies.com/category/roguelikes/
 */
var Game = {
    _display: null,
    _currentScreen: null,

    init: function() {
        this._display = new ROT.Display({
            width: UI_SCREEN_WIDTH,
            height: UI_SCREEN_HEIGHT,
            fontSize: 24,
            fontStyle: "bold"
        });

        var self = this,
            bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is received, send it to the
                // screen if there is one
                if (self._currentScreen !== null) {
                    // Send the event type and data to the screen
                    self._currentScreen.handleInput(event, e);
                }
            });
        };
        // Bind keyboard input events
        bindEventToScreen("keydown");
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
        if (this._currentScreen !== null) {
            this._currentScreen.enter();
            this.refresh();
        }
    },
};
