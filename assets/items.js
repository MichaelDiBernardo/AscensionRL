Game.Mixins.Item = {
    name: "Item",
    groupName: "Item",
    init: function(properties) {
        var properties = properties || {};
        if (properties.itemType === undefined) {
            throw "Must define item type on item templates!";
        }

        this.weight = properties.weight || 1;
        this.itemType = properties.itemType;
    },
    isRealThing: function() {
        return this.itemType != IT_NULLOBJ;
    }
}

Game.ItemRepository = new Game.EntityRepository();
