Game.Equipment = function(givenWearables) {
    this._slots = [];
    this._initSlots(givenWearables || []);
};

Game.Equipment.SlotTypes = [
    SLOT_WEAPON,
    SLOT_RANGED,
    SLOT_LEFT_RING,
    SLOT_RIGHT_RING,
    SLOT_AMULET,
    SLOT_LIGHT,
    SLOT_BODY,
    SLOT_OFFHAND,
    SLOT_HELM,
    SLOT_GLOVES,
    SLOT_BOOTS
];

Game.Equipment.prototype.protectionRoll = function() {
    var armor = _.filter(this._slots, function(slot) {
            return slot.isRealThing() && slot.getSlotType() != SLOT_WEAPON;
        }),
        rolls = _.map(armor, function(a) { return a.protectionRoll(); });
    return new Die.AggregateRoll(rolls);
};

Game.Equipment.prototype.meleeBonus = function() {
    var meleeBonuses = _.map(this._slots, function(a) { return a.meleeBonus; }),
        toReturn = _.reduce(meleeBonuses, function(s, n) { return s + n; });
    return toReturn;
};

Game.Equipment.prototype.evasionBonus = function() {
    var evasionBonuses = _.map(this._slots, function(a) { return a.evasionBonus; }),
        toReturn = _.reduce(evasionBonuses, function(s, n) { return s + n; });
    return toReturn;
};

Game.Equipment.prototype.damroll = function(properties) {
     var weapon = this._slots[SLOT_WEAPON],
         isTwoHanded = !this._slots[SLOT_OFFHAND].isRealThing();
     properties.isTwoHanded = isTwoHanded;
     return weapon.damroll(properties);
};

Game.Equipment.prototype.getSlotTypes = function() {
    return Game.Equipment.SlotTypes;
};

Game.Equipment.prototype.getWearableInSlot = function(slot) {
    return this._slots[slot];
};

Game.Equipment.prototype.getWeapon = function() {
    return this._slots[SLOT_WEAPON];
};

Game.Equipment.prototype.equip = function(wearable) {
    if (!wearable.hasMixin("Wearable")) {
        throw "%s isn't wearable!".format(wearable.getName());
    }

    var slot = wearable.getSlotType();
    if ($.inArray(slot, this.getSlotTypes()) == -1) {
        throw "Slot %s is not a valid slot!".format(slot);
    }

    var displacedItems = [],
        displacedItem = this._slots[slot];

    this._slots[slot] = wearable;

    if (displacedItem.isRealThing()) {
        displacedItems.push(displacedItem);
    }

    // If it's a 2-handed weapon, we need to displace the shield slot also.
    if (wearable.hasMixin("Weapon") && wearable.hands === HANDS_2H) {
        displacedItem = this._slots[SLOT_OFFHAND];
        if (displacedItem.isRealThing()) {
            displacedItems.push(displacedItem);
        }
    }

    return displacedItems;
};

Game.Equipment.prototype._initSlots = function(givenWearables) {
    var slotTypes = this.getSlotTypes(),
        length = slotTypes.length;

    for (var i = 0; i < length; i++) {
        var slot = slotTypes[i];

        if (slot === SLOT_WEAPON) {
            this._slots[slot] = Game.ItemRepository.create('fist');
        } else {
            this._slots[slot] = Game.ItemRepository.create('skin');
        }
    }

    length = givenWearables.length;
    for (i = 0; i < givenWearables.length; i++) {
        var displaced = this.equip(givenWearables[i]);
        if (displaced.length > 0) {
            throw new Error("Multiple wearables given for slot " + i);
        }
    }
};
