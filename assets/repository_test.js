module("repository");

test("Test create dudes", function() {
    var sut = new Game.EntityRepository();
    sut.define('orc', {
        glyph: new Game.Glyph({
            character: "o",
            foreground: "green",
            background: "black"
        }),
        name: "Orc",
        mixins: [Game.Mixins.Moveable, Game.Mixins.WanderingActor, Game.Mixins.Fighter]
    });

    var dude = sut.create('orc');
    equal("Orc", dude.getName());
});
