test("Default stats are 0", function() {
    var sut = new Game.Stats();
    strictEqual(sut.str(), 0);
    strictEqual(sut.dex(), 0);
    strictEqual(sut.con(), 0);
    strictEqual(sut.gra(), 0);
});
