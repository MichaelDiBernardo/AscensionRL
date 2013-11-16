Game.Mixins.Item = {
    name: "Item",
    groupName: "Item",
    init: function(properties) {
        var properties = properties || {};
        this.weight = properties.weight || 1;
    }
}

Game.ItemRepository = new Game.EntityRepository();
