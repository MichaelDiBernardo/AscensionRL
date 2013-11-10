module("weapon");

test("Test negative damage sides due to -ve str", function() {
    var sut = new Game.Weapon({
        damageDice: 1,
        damageSides: 7,
        weight: 10
    });

    equal(6, sut.computeSidesForStrength(-1));
});

test("Test negative damage sides capped by weight", function() {
    var sut = new Game.Weapon({
        damageDice: 1,
        damageSides: 7,
        weight: 10
    });

    equal(6, sut.computeSidesForStrength(-2));
});

test("Test damage sides capped by weight", function() {
    var sut = new Game.Weapon({
        damageDice: 1,
        damageSides: 7,
        weight: 10
    });

    equal(8, sut.computeSidesForStrength(2));
});

test("Test multiple damage sides, no weight cap", function() {
    var sut = new Game.Weapon({
        damageDice: 3,
        damageSides: 5,
        weight: 70
    });

    equal(8, sut.computeSidesForStrength(3));
});

test("Test multiple damage sides, weight cap", function() {
    var sut = new Game.Weapon({
        damageDice: 3,
        damageSides: 5,
        weight: 70
    });

    // HAAADDDOOORRRRR
    equal(12, sut.computeSidesForStrength(10));
});

test("Test multiple damage sides lost due to -ve str", function() {
    var sut = new Game.Weapon({
        damageDice: 3,
        damageSides: 5,
        weight: 70
    });

    equal(2, sut.computeSidesForStrength(-3));
});

test("Can't go less than 1 side for -ve str.", function() {
    var sut = new Game.Weapon({
        damageDice: 3,
        damageSides: 5,
        weight: 70
    });

    equal(1, sut.computeSidesForStrength(-10));
});

test("0 str has no effect on sides", function() {
    var sut = new Game.Weapon({
        damageDice: 3,
        damageSides: 5,
        weight: 70
    });

    equal(5, sut.computeSidesForStrength(0));
});

test("Less-than-1lb weight gives no str bonus", function() {
    var sut = new Game.Weapon({
        damageDice: 1,
        damageSides: 5,
        weight: 5
    });

    $.each([-2, -1, 0, 1, 2], function(_, str) {
        equal(5, sut.computeSidesForStrength(str));
    });
});
