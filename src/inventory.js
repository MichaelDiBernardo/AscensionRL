Game.Inventory = function(properties) {
    properties = properties || {};
    this._items = [];
    if (properties.capacity === undefined) {
        this._capacity = INV_CAPACITY;
    } else {
        this._capacity = properties.capacity;
    }
};

Game.Inventory.prototype.itemCount = function() {
    return 0;
};

Game.Inventory.prototype.totalCapacity = function() {
    return this._capacity;
};

Game.Inventory.prototype.roomLeft = function() {
    return this._capacity - this.itemCount;
};
