module("stats");
test("Default stats are 0", function() {
    var sut = new Game.Stats();
    strictEqual(sut.str(), 0);
    strictEqual(sut.dex(), 0);
    strictEqual(sut.con(), 0);
    strictEqual(sut.gra(), 0);
});

test("Set default stats", function() {
    var sut = new Game.Stats({
        str: 2,
        dex: 1,
        gra: 0
    });
    strictEqual(sut.str(), 2);
    strictEqual(sut.dex(), 1);
    strictEqual(sut.con(), 0);
    strictEqual(sut.gra(), 0);
});
