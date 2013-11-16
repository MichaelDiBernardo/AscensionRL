module("equipment");

test("Test empty equipment", function() {
    var sut = new Game.Equipment();
    equal("(none)", sut.getWeapon().getName());
    deepEqual(sut.protection(), [0, 0]);
});
