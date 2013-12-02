Game.Inventory = function(properties) {
    properties = properties || {};
    this._items = [];
    this._count = 0;
    this._slotChars = "abcdefghijklmnopqrstuvw";
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
    if (!item.hasMixin("Item")) {
        throw new Error("Tried to add non-item to inventory.");
    }
    this._items.push(item);
    this._count++;
};

Game.Inventory.prototype.getItemMap = function() {
    var itemMap = {},
        itemKey = null;

    _.forEach(this._items, function(item, index) {
        itemKey = this._slotChars[index];
        itemMap[itemKey] = item;
    }, this);

    return itemMap;
};
