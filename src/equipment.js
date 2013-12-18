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
    SLOT_CLOAK,
    SLOT_OFFHAND,
    SLOT_HELM,
    SLOT_GLOVES,
    SLOT_BOOTS
];

Game.Equipment.LettersToSlots = {
    "a" : SLOT_WEAPON,
    "b" : SLOT_RANGED,
    "c" : SLOT_LEFT_RING,
    "d" : SLOT_RIGHT_RING,
    "e" : SLOT_AMULET,
    "f" : SLOT_LIGHT,
    "g" : SLOT_BODY,
    "h" : SLOT_CLOAK,
    "i" : SLOT_OFFHAND,
    "j": SLOT_HELM,
    "k" : SLOT_GLOVES,
    "l" : SLOT_BOOTS
};

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

    var equippingWeapon = (slot === SLOT_WEAPON),
        equippingOffhand = (slot === SLOT_OFFHAND),
        equipping2H = equippingWeapon && wearable.hands === HANDS_2H,
        holding2H = this._slots[SLOT_WEAPON].hands === HANDS_2H,
        is2HJuggle = equipping2H || (holding2H && (equippingWeapon || equippingOffhand)),
        displacedItems = [],
        displacedItem = null,
        slotsToCheck = is2HJuggle ? [SLOT_WEAPON, SLOT_OFFHAND] : [slot];

    _.forEach(slotsToCheck, function(currentSlot) {
        displacedItem = this._slots[currentSlot];
        if (displacedItem.isRealThing()) {
            displacedItems.push(displacedItem);
            this._nullifySlot(currentSlot);
        }
    }, this);

    this._slots[slot] = wearable;
    return displacedItems;
};

Game.Equipment.prototype.unequipItemBySlotLetter = function(slotLetter) {
    var equipSlotForLetter = Game.Equipment.LettersToSlots[slotLetter],
        equipToReturn = this.getWearableInSlot(equipSlotForLetter);

    this._nullifySlot(equipSlotForLetter);

    if (!equipToReturn.isRealThing()) {
        return null;
    }

    return equipToReturn;
};

Game.Equipment.prototype._initSlots = function(givenWearables) {
    var slotTypes = this.getSlotTypes(),
        length = slotTypes.length;

    for (var i = 0; i < length; i++) {
        var slot = slotTypes[i];
        this._nullifySlot(slot);
    }

    length = givenWearables.length;
    for (i = 0; i < givenWearables.length; i++) {
        var displaced = this.equip(givenWearables[i]);
        if (displaced.length > 0) {
            throw new Error("Multiple wearables given for slot " + i + ": " + _.invoke(displaced, "getName"));
        }
    }
};

Game.Equipment.prototype._nullifySlot = function(slot) {
    var nullObjTag = slot === SLOT_WEAPON ? "fist" : "skin",
        nullObj = Game.ItemRepository.create(nullObjTag);

    this._slots[slot] = nullObj;
};
