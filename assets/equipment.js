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

Game.Equipment.prototype.protectionRoll = function() {
    var slotValues = $.map(this._slots, function(v) { return v; }),
        armor = $.grep(slotValues, function(slot) {
            return slot.isRealThing() && slot.getSlotType() != "SLOT_WEAPON";
        }),
        rolls = $.map(armor, function(a) { return a.protectionRoll(); });
    return new Die.AggregateRoll(rolls);
}

Game.Equipment.prototype.meleeBonus = function() {
    return this.getWeapon().meleeBonus + this.getArmor().meleeBonus;
}

Game.Equipment.prototype.evasionBonus = function() {
    return this.getWeapon().evasionBonus + this.getArmor().evasionBonus;
}

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
