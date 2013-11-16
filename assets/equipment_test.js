(function() {
    var fakeRepo = new Game.EntityRepository();
    fakeRepo.define("sword", {
        name: "Sword",
        damageDice: 1,
        damageSides: 7,
        meleeBonus: 0,
        evasionBonus: 1,
        weight: 10,
        slotType: "SLOT_WEAPON",
        mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
    });

    fakeRepo.define("armor", {
        name: "Armor",
        weight: 100,
        slotType: "SLOT_BODY",
        mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
    });

    module("equipment");

    test("Test empty equipment protection.", function() {
        var sut = new Game.Equipment();
        deepEqual(sut.protection(), [0, 0]);
    });

    test("Test empty equipment has none in all slots.", function() {
        var sut = new Game.Equipment(),
            slotTypes = sut.getSlotTypes(),
            length = slotTypes.length;

        for (var i = 0; i< length; i++) {
            var slot = slotTypes[i];
            equal("(none)", sut.getWearableInSlot(slot).getName());
        }
    });

    test("Test equip weapon into empty slot.", function() {
        var sut = new Game.Equipment();
        sut.equip(fakeRepo.create("sword"));

        var weapon = sut.getWearableInSlot("SLOT_WEAPON");
        equal(weapon.getName(), "Sword");
        equal(7, weapon.damageSides);
    });

    test("Test equip armor into empty slot.", function() {
        var sut = new Game.Equipment();
        sut.equip(fakeRepo.create("armor"));

        var armor = sut.getWearableInSlot("SLOT_BODY");
        equal(armor.getName(), "Armor");
    });

    test("Test equip something into bad slot.", function() {
        var sut = new Game.Equipment(),
            passed = false;

        fakeRepo.define("weirdthing", {
            name: "WhichSlot",
            weight: 100,
            slotType: "SLOT_BLORG",
            mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
        });

        throws(
            function() {
                sut.equip(fakeRepo.create("weirdthing"));
            },
            "No exception raised for equipping to bad slot."
        );
    });
})();
