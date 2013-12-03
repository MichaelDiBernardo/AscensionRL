Game.Inventory = function(properties) {
    properties = properties || {};
    this._count = 0;
    this._slotChars = "abcdefghijklmnopqrstuvw";
    if (properties.capacity === undefined) {
        this._capacity = INV_CAPACITY;
    } else {
        this._capacity = properties.capacity;
    }
    this._items = new Array(this._capacity);
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
    this._items[this._count] = item;
    this._count++;
};

Game.Inventory.prototype.getItemBySlot = function(slotKey) {
    var slotIndex = this._slotChars.indexOf(slotKey);
    return this._items[slotIndex];
};

Game.Inventory.prototype.removeItemBySlot = function(slotKey) {
    var slotIndex = this._slotChars.indexOf(slotKey),
        toReturn = this._items[slotIndex];

    this._items[slotIndex] = null;
    this._count--;

    this._compact();

    return toReturn;
};

Game.Inventory.prototype.getItemMap = function() {
    var itemMap = {},
        itemKey = null;

    _.forEach(_.filter(this._items), function(item, index) {
        itemKey = this._slotChars[index];
        itemMap[itemKey] = item;
    }, this);

    return itemMap;
};

Game.Inventory.prototype.isFull = function() {
    return this.itemCount() == this.totalCapacity();
};

Game.Inventory.prototype._compact = function() {
    // Fast enough for now. 2 new array allocations though :/
    var onlyItems = _.compact(this._items),
        newItems = new Array(this._capacity);

    _.forEach(onlyItems, function(val, index) {
        newItems[index] = val;
    });

    this._items = newItems;
};
