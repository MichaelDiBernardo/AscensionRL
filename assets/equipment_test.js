(function() {
    var fakeRepo, sut;

    module("equipment", {
        setup: function() {
            fakeRepo = new Game.EntityRepository();
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

            fakeRepo.define("axe", {
                name: "Axe",
                damageDice: 3,
                damageSides: 4,
                slotType: "SLOT_WEAPON",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
            });

            fakeRepo.define("armor", {
                name: "Armor",
                weight: 100,
                slotType: "SLOT_BODY",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
            });
            sut = new Game.Equipment();
        }
    });

    test("Empty equipment protection.", function() {
        deepEqual(sut.protection(), [0, 0]);
    });

    test("Empty equipment has none in all slots.", function() {
        var slotTypes = sut.getSlotTypes(),
            length = slotTypes.length;

        for (var i = 0; i< length; i++) {
            var slot = slotTypes[i];
            equal("(none)", sut.getWearableInSlot(slot).getName());
        }
    });

    test("Equip weapon into empty slot.", function() {
        sut.equip(fakeRepo.create("sword"));

        var weapon = sut.getWearableInSlot("SLOT_WEAPON");
        equal(weapon.getName(), "Sword");
        equal(7, weapon.damageSides);
    });

    test("Equip armor into empty slot.", function() {
        sut.equip(fakeRepo.create("armor"));

        var armor = sut.getWearableInSlot("SLOT_BODY");
        equal(armor.getName(), "Armor");
    });

    test("Equip something into bad slot.", function() {
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

    test("Equip into occupied slot returns old item.", function() {
        var oldItem = sut.equip(fakeRepo.create('sword'));
        equal(oldItem, null);

        oldItem = sut.equip(fakeRepo.create('axe'));
        equal(oldItem.getName(), "Sword");
        equal("Axe", sut.getWearableInSlot("SLOT_WEAPON").getName());
    });

})();
