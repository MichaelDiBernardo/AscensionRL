module("equipment");

test("Test empty equipment", function() {
    var sut = new Game.Equipment();
    equal(sut.weapon.damageSides, 0);
    equal(sut.weapon.damageDice, 1);
    deepEqual(sut.protection(), [0, 0]);
});
