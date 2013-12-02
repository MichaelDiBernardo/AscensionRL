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

})();
