Game.Equipment = function(properties) {
    properties = properties || {};
    this._slots = {};
    this._initSlots();
    this._weapon = properties.weapon || Game.ItemRepository.create('fist');
    this._armor = properties.armor || Game.ItemRepository.create('skin');
}

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

Game.Equipment.prototype.getWeapon = function() {
    return this._weapon;
}

Game.Equipment.prototype.getArmor = function() {
    return this._armor;
}

Game.Equipment.prototype.protection = function() {
    return [
        this.getArmor().protectionDice,
        this.getArmor().protectionDice * this.getArmor().protectionSides
    ];
}

Game.Equipment.prototype.protectionRoll = function() {
    return Die.ndx(this.getArmor().protectionDice, this.getArmor().protectionSides);
}

Game.Equipment.prototype.protectionRange = function() {
    // TODO: This will change once we have multiple armor equips.
    return [
        this.getArmor().protectionDice,
        this.getArmor().protectionDice * this.getArmor().protectionSides
    ];
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

    this._slots[slot] = wearable;
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
