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

//test("Stats effect skills", function() {
//    var stats = new Game.Stats({
//        str: 2,
//        dex: 4,
//        con: 3,
//        gra: 1
//    });
//
//    var sut = new Game.Skills(stats, {
//        baseMelee: 1,
//        baseRanged: 2,
//        baseEvasion: 3,
//        baseWill: 4,
//        basePerception: 5,
//        baseMagic: 6
//    });
//
//    strictEqual(sut.melee(), 5);
//    strictEqual(sut.ranged(), 6);
//    strictEqual(sut.evasion(), 7);
//    strictEqual(sut.will(), 5);
//    strictEqual(sut.perception(), 6);
//    strictEqual(sut.magic(), 7);
//});
