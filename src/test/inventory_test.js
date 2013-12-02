(function() {
    var fakeRepo, sut;

    module("inventory", {
        setup: function() {
            fakeRepo = new Game.EntityRepository();
            fakeRepo.define("sword", {
                name: "Sword",
                weight: 10,
                slotType: SLOT_WEAPON,
                itemType: IT_SWORD,
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
            });
            sut = new Game.Inventory();
        }
    });

    test("Empty inventory has nothing in it.", function() {
        equal(sut.itemCount(), 0);
    });

    test("Default inventory capacity is from constant.", function() {
        equal(sut.totalCapacity(), INV_CAPACITY);
    });

    test("Can override capacity.", function() {
        sut = new Game.Inventory({ capacity: 10 });
        equal(sut.totalCapacity(), 10);
    });

    test("Adding an item increases itemcount and reduces capacity.", function() {
        sut.addItem(fakeRepo.create("sword"));
        equal(sut.itemCount(), 1);
        equal(sut.roomLeft(), 22);
    });

    test("Adding something that's not an item throws exception.", function() {
        fakeRepo.define("confused", {
            name: "wha",
            mixins: [Game.Mixins.Wearable]
        });

        throws(function() {
                sut.addItem(fakeRepo.create("confused"));
            },
            "Didn't throw for entity without Item mixin."
        );
    });
})();
