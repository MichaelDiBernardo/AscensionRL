/**
 * Loader that can grab plaintext screen "drawings" and crunch them down into
 * rows for display by the splashScreenRenderer.
 *
 * Heavily inspired by the loaders in the Royal Wedding project (although those
 * use a custom Promise implementation rather than async requests through
 * jQuery.)
 */
Game.SplashScreenLoader = {
    loadFromUrl: function(screenUrl) {
        // Add random cruft to querystring to bypass browser cache.
        var screenData = ["... couldn't load screen!"],
            params = {
                c: ROT.RNG.getUniform() /* bypass cache */
            };

        $.ajax({
            url: screenUrl,
            data: params,
            async: false,
            success: function(data) {
                // Deal with Unix-style linebreaks in screens.
                screenData = data.replace(/\r\n/g, "\n").split("\n");
            }
        });
        return screenData;
    }
};
