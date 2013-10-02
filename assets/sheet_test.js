test("Stats effect skills", function() {
    var stats = new Game.Stats({
        str: 2,
        dex: 4,
        con: 3,
        gra: 1
    });

    var skills = new Game.Skills({
        melee: 1,
        ranged: 2,
        evasion: 3,
        will: 4,
        perception: 5,
        magic: 6
    });

    var sut = new Game.Sheet({
        stats: stats,
        skills: skills
    });

    strictEqual(sut.melee(), 5);
    strictEqual(sut.ranged(), 6);
    strictEqual(sut.evasion(), 7);
    strictEqual(sut.will(), 5);
    strictEqual(sut.perception(), 6);
    strictEqual(sut.magic(), 7);
});
