module("skills");
test("Default skills are 0", function() {
    var sut = new Game.Skills();

    // Dex skills
    strictEqual(sut.melee(), 0);
    strictEqual(sut.ranged(), 0);
    strictEqual(sut.evasion(), 0);

    // Gra skills
    strictEqual(sut.will(), 0);
    strictEqual(sut.perception(), 0);
    strictEqual(sut.magic(), 0);
});

test("Giving default skill investments", function() {
    var sut = new Game.Skills({
        melee: 4,
        will: 1
    });

    strictEqual(sut.melee(), 4);
    strictEqual(sut.ranged(), 0);
    strictEqual(sut.evasion(), 0);
    strictEqual(sut.will(), 1);
    strictEqual(sut.perception(), 0);
    strictEqual(sut.magic(), 0);
});
