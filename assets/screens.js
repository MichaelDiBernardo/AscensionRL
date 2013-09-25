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
            var startIndex = 0;
            while (startIndex < line.length && line[startIndex] == " ") {
                startIndex++;
            }
            return startIndex;
        }

        // Render the rows.
        for (var rowIndex = 0; rowIndex < rowsData.length; rowIndex++) {
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
//        if (inputType === 'keydown') {
//            if (inputData.keyCode === ROT.VK_RETURN) {
//                Game.switchScreen(Game.Screen.playScreen);
//            }
//        }
    }
}
