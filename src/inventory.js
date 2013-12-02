Game.Inventory = function(properties) {
    properties = properties || {};
    this._items = [];
    this._count = 0;
    if (properties.capacity === undefined) {
        this._capacity = INV_CAPACITY;
    } else {
        this._capacity = properties.capacity;
    }
};

Game.Inventory.prototype.itemCount = function() {
    return this._count;
};

Game.Inventory.prototype.totalCapacity = function() {
    return this._capacity;
};

Game.Inventory.prototype.roomLeft = function() {
    return this.totalCapacity() - this.itemCount();
};

Game.Inventory.prototype.addItem = function(item) {
    this._items.push(item);
    this._count++;
};
