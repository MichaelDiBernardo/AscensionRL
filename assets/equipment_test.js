module("equipment");

test("Test empty equipment", function() {
    var sut = new Game.Equipment();
    equal(sut.weapon.damageDice, 1);
    equal(sut.weapon.damageSides, 4);
    deepEqual(sut.protection(), [0, 0]);
});
