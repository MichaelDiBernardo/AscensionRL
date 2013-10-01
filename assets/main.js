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
