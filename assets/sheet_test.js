module("sheet");
test("Stats effect skills", function() {
    var stats = new Game.Stats({
        str: 2,
        dex: 4,
        con: 3,
        gra: 1
    }),

    skills = new Game.Skills({
        melee: 1,
        ranged: 2,
        evasion: 3,
        will: 4,
        perception: 5,
        magic: 6
    }),

    sut = new Game.Sheet({
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

test("Test max HP at 0", function() {
    var stats = new Game.Stats({
        con: 0,
    }),

    skills = new Game.Skills(),

    sut = new Game.Sheet({
        stats: stats,
        skills: skills
    });

    strictEqual(sut.maxHP(), 20);
});

test("Test max HP at 6", function() {
    var stats = new Game.Stats({
        con: 6,
    }),

    skills = new Game.Skills(),

    sut = new Game.Sheet({
        stats: stats,
        skills: skills
    });

    strictEqual(sut.maxHP(), 59);
});

test("Test max HP at -2", function() {
    var stats = new Game.Stats({
        con: -2,
    }),

    skills = new Game.Skills(),

    sut = new Game.Sheet({
        stats: stats,
        skills: skills
    });

    strictEqual(sut.maxHP(), 13);
});
