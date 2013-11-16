module("equipment");

test("Test empty equipment protection.", function() {
    var sut = new Game.Equipment();
    deepEqual(sut.protection(), [0, 0]);
});

test("Test empty equipment has none in all slots.", function() {
    var sut = new Game.Equipment();
    for (var slot in sut.getSlotTypes()) {
        equal("(none)", sut.getWearableFromSlot(slot).getName());
    }
});
