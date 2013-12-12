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
            fakeRepo.define("sword2", {
                name: "Sword2",
                weight: 10,
                slotType: SLOT_WEAPON,
                itemType: IT_SWORD,
                mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
            });
            fakeRepo.define("sword3", {
                name: "Sword3",
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
        equal(sut.roomLeft(), INV_CAPACITY - 1);
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

    test("Get map of items from slot -> item", function() {
        sut.addItem(fakeRepo.create("sword"));
        sut.addItem(fakeRepo.create("sword2"));
        sut.addItem(fakeRepo.create("sword3"));

        var map = sut.getItemMap();

        equal(_.size(map), 3);
        equal(map.a.getName(), "Sword");
        equal(map.b.getName(), "Sword2");
        equal(map.c.getName(), "Sword3");
    });

    test("Get item from slot", function() {
        sut.addItem(fakeRepo.create("sword"));
        sut.addItem(fakeRepo.create("sword2"));
        sut.addItem(fakeRepo.create("sword3"));

        equal(sut.getItemBySlot("a").getName(), "Sword");
        equal(sut.getItemBySlot("c").getName(), "Sword3");
    });

    test("Get item from nonexistent slot", function() {
        sut.addItem(fakeRepo.create("sword"));

        throws(function() {
                sut.getItemBySlot("b");
            },
            "No exception raised for pulling from empty slot."
        );
    });

    test("Drop/remove item by slot.", function() {
        sut.addItem(fakeRepo.create("sword"));

        var item = sut.removeItemBySlot("a");
        equal(item.getName(), "Sword");
        equal(sut.itemCount(), 0);
    });

    test("Add, remove from middle, refetch.", function() {
        sut.addItem(fakeRepo.create("sword"));
        sut.addItem(fakeRepo.create("sword2"));
        sut.addItem(fakeRepo.create("sword3"));

        sut.removeItemBySlot("b");

        equal(sut.getItemBySlot("a").getName(), "Sword");
        equal(sut.getItemBySlot("b").getName(), "Sword3");

        sut.removeItemBySlot("a");
        equal(sut.getItemBySlot("a").getName(), "Sword3");
    });

    test("isFull predicate.", function() {
        ok(!sut.isFull());

        sut = new Game.Inventory({ capacity: 1 });
        sut.addItem(fakeRepo.create("sword"));

        ok(sut.isFull());
    });

    test("Dumping collection of stuff that overflows.", function() {
        sut = new Game.Inventory({ capacity: 1 });
        var spillOver = sut.addItemsUntilFull([
            fakeRepo.create("sword"),
            fakeRepo.create("sword2")
        ]);

        equal(spillOver.length, 1);
        equal(spillOver[0].getName(), "Sword2");
    });
})();
