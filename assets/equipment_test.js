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
                hands: "1H",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
            });

            fakeRepo.define("axe", {
                name: "Axe",
                damageDice: 3,
                damageSides: 4,
                meleeBonus: -3,
                evasionBonus: 0,
                weight: 35,
                slotType: "SLOT_WEAPON",
                hands: "1.5H",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
            });

            fakeRepo.define("armor", {
                name: "Armor",
                meleeBonus: 0,
                evasionBonus: -1,
                protectionDice: 1,
                protectionSides: 4,
                weight: 100,
                slotType: "SLOT_BODY",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
            });

            fakeRepo.define("gauntlets", {
                name: "Gauntlets",
                meleeBonus: -1,
                evasionBonus: 0,
                protectionDice: 1,
                protectionSides: 2,
                weight: 30,
                slotType: "SLOT_GLOVES",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
            });

            fakeRepo.define("helm", {
                name: "Helm",
                meleeBonus: 0,
                evasionBonus: -1,
                protectionDice: 1,
                protectionSides: 2,
                weight: 100,
                slotType: "SLOT_HELM",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
            });

            fakeRepo.define("shield", {
                name: "Shield",
                meleeBonus: 0,
                evasionBonus: 0,
                protectionDice: 1,
                protectionSides: 4,
                weight: 30,
                slotType: "SLOT_OFFHAND",
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
            });

            sut = new Game.Equipment();
        }
    });

    test("Empty equipment protection.", function() {
        var roll = sut.protectionRoll();

        equal(roll.minValue(), 0);
        equal(roll.maxValue(), 0);
        equal(roll.toString(), "[0-0]");
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

    test("Protection roll is sum of all rolls.", function() {
        sut.equip(fakeRepo.create('armor'));
        sut.equip(fakeRepo.create('helm'));
        var roll = sut.protectionRoll();

        equal(roll.minValue(), 2);
        equal(roll.maxValue(), 6);
        equal(roll.toString(), "[2-6]");
    });

    test("Melee bonus is sum of all melee bonuses.", function() {
        sut.equip(fakeRepo.create('armor')); // +0
        sut.equip(fakeRepo.create('axe')); // - 3
        sut.equip(fakeRepo.create('gauntlets')); // -1
        sut.equip(fakeRepo.create('helm')); // +0

        equal(sut.meleeBonus(), -4);
    });

    test("Evasion bonus is sum of all evasion bonuses.", function() {
        sut.equip(fakeRepo.create('armor')); // -1
        sut.equip(fakeRepo.create('sword')); // +1
        sut.equip(fakeRepo.create('gauntlets')); // 0
        sut.equip(fakeRepo.create('helm')); // -1

        equal(sut.evasionBonus(), -1);
    });

    test("Damroll for single 1H weapon.", function() {
        sut.equip(fakeRepo.create('sword'));
        var roll = sut.damroll({
            strength: 2,
            numCrits: 1
        });
        equal(roll.toString(), "2d8");
    });

    test("Damroll for hand-and-a-half without shield.", function() {
        sut.equip(fakeRepo.create('axe'));
        var roll = sut.damroll({
            strength: 2,
            numCrits: 1
        });

        // Should get 2 damage sides from 1.5H wield, 2 from str.
        equal(roll.toString(), "4d8");
    });

    test("Damroll for hand-and-a-half with shield.", function() {
        sut.equip(fakeRepo.create('axe'));
        sut.equip(fakeRepo.create('shield'));
        var roll = sut.damroll({
            strength: 2,
            numCrits: 1
        });

        // Should get just 2 extra sides from str.
        equal(roll.toString(), "4d6");
    });
})();
