Game.Mixins.Item = {
    name: "Item",
    groupName: "Item",
    init: function(properties) {
        properties = properties || {};
        if (properties.itemType === undefined) {
            throw "Must define item type on item templates!";
        }

        this.weight = properties.weight || 1;
        this.itemType = properties.itemType;

        if (properties.generate === undefined) {
            this.generate = true;
        } else {
            this.generate = properties.generate;
        }
    },
    isRealThing: function() {
        return this.itemType != IT_NULLOBJ;
    },
    getWeightInLbs: function() {
        return this.weight / 10.0;
    }

};

Game.ItemRepository = new Game.EntityRepository();
