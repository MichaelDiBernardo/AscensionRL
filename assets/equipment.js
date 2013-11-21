Game.Equipment = function(properties) {
    properties = properties || {};
    this._slots = {};
    this._initSlots();
}

// TODO: It feels like we're conflating "item type" and "slot it should go in"
// as the same concept.
Game.Equipment.SlotTypes = [
    "SLOT_WEAPON",
    "SLOT_RANGED",
    "SLOT_LEFT_RING",
    "SLOT_RIGHT_RING",
    "SLOT_AMULET",
    "SLOT_LIGHT",
    "SLOT_BODY",
    "SLOT_OFFHAND",
    "SLOT_HELM",
    "SLOT_GLOVES",
    "SLOT_BOOTS"
]

// TODO: use _onAllSlots as a generic fn for these three :/
Game.Equipment.prototype.protectionRoll = function() {
    var slotValues = _.map(this._slots, function(v) { return v; }),
        armor = _.filter(slotValues, function(slot) {
            return slot.isRealThing() && slot.getSlotType() != "SLOT_WEAPON";
        }),
        rolls = _.map(armor, function(a) { return a.protectionRoll(); });
    return new Die.AggregateRoll(rolls);
}

Game.Equipment.prototype.meleeBonus = function() {
    var slotValues = _.map(this._slots, function(v) { return v; }),
        meleeBonuses = _.map(slotValues, function(a) { return a.meleeBonus; }),
        toReturn = _.reduce(meleeBonuses, function(s, n) { return s + n; });
    return toReturn;
}

Game.Equipment.prototype.evasionBonus = function() {
    var slotValues = _.map(this._slots, function(v) { return v; }),
        evasionBonuses = _.map(slotValues, function(a) { return a.evasionBonus; }),
        toReturn = _.reduce(evasionBonuses, function(s, n) { return s + n; });
    return toReturn;
}

//Game.Equipment.prototype._onAllSlots = function(reducer, filter) {
//    var f = filter || function() { return true; },
//        slotValues = _.map(this._slots, function(v) { return v; }),
//        filtered = _.filter(slotValues, f),
//        toReturn = _.reduce(filtered, reducer);
//    return toReturn;
//
//}

Game.Equipment.prototype.getSlotTypes = function() {
    return Game.Equipment.SlotTypes;
}

Game.Equipment.prototype.getWearableInSlot = function(slot) {
    return this._slots[slot];
}

Game.Equipment.prototype.equip = function(wearable) {
    if (!wearable.hasMixin('Wearable')) {
        throw "%s isn't wearable!".format(wearable.getName());
    }

    var slot = wearable.getSlotType();
    if (!slot) {
        throw "Wearable %s has no slot type!".format(wearable.getName());
    }

    if ($.inArray(slot, this.getSlotTypes()) == -1) {
        throw "Slot %s is not a valid slot!".format(slot);
    }

    var displacedItem = this._slots[slot];
    this._slots[slot] = wearable;

    if (displacedItem.isRealThing()) {
        return displacedItem;
    }
    return null;
}

Game.Equipment.prototype._initSlots = function() {
    var slotTypes = this.getSlotTypes(),
        length = slotTypes.length;

    for (var i = 0; i < length; i++) {
        var slot = slotTypes[i];
        if (slot === "SLOT_WEAPON") {
            this._slots[slot] = Game.ItemRepository.create('fist');
        } else {
            this._slots[slot] = Game.ItemRepository.create('skin');
        }
    }
}
