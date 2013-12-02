Game.Mixins.Wearable = {
    name: "Wearable",
    groupName: "Wearable",
    init: function(properties) {
        properties = properties || {};
        this.meleeBonus = properties.meleeBonus || 0;
        this.evasionBonus = properties.evasionBonus || 0;
        if (properties.slotType === undefined) {
            this._slotType = SLOT_ANY;
        } else {
            this._slotType = properties.slotType;
        }
    },
    getSlotType: function() {
        return this._slotType;
    }
};

Game.Mixins.Weapon = {
    name: "Weapon",
    groupName: "Weapon",
    init: function(properties) {
        properties = properties || {};
        this.damageDice = properties.damageDice || 0;
        this.damageSides = properties.damageSides || 0;
        // Undefined or nil hands?
        if (properties.hands === undefined) {
          this.hands = HANDS_1H;
        } else {
          this.hands = properties.hands;
        }
    },

    damroll: function(properties) {
        var damageDice = this.damageDice + properties.numCrits,
            damageSides = this.computeSidesForStrength(properties.strength,
                    properties.isTwoHanded);

        return new Die.Roll(damageDice, damageSides);
    },

    computeSidesForStrength: function(str, isTwoHanded) {
        var absStr = Math.abs(str),
            strSign = str >= 0 ? 1 : -1,
            maxBonus = Math.floor(this.weight / 10),
            isHandHalf = this.hands === HANDS_15H,
            handHalfBonus = (isHandHalf && !!isTwoHanded) ? 2 : 0,
            sidesDelta = strSign * Math.min(absStr, maxBonus) + handHalfBonus;

        // All attacks must have at least one damage side. This is carried over
        // from Sil.
        return Math.max(1, this.damageSides + sidesDelta);
    }
};

Game.Mixins.Armor = {
    name: "Armor",
    groupName: "Armor",
    init: function(properties) {
        properties = properties || {};
        this.protectionDice = properties.protectionDice || 0;
        this.protectionSides = properties.protectionSides || 0;
    },
    protectionRoll: function() {
        return new Die.Roll(this.protectionDice, this.protectionSides);
    }
};

Game.ItemRepository.define('fist', {
    name: "(none)",
    damageDice: 1,
    damageSides: 4,
    meleeBonus: 0,
    evasionBonus: 0,
    weight: 40, // Sil-style 4lb fists :>
    hands: HANDS_1H,
    slotType: SLOT_ANY,
    itemType: IT_NULLOBJ,
    mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
});

Game.ItemRepository.define('skin', {
    name: "(none)",
    protectionDice: 0,
    protectionSides: 0,
    meleeBonus: 0,
    evasionBonus: 0,
    weight: 0,
    slotType: SLOT_ANY,
    itemType: IT_NULLOBJ,
    mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
});

Game.ItemRepository.define('leather', {
    name: "Leather Armor",
    glyph: new Game.Glyph({
        character: ")",
        foreground: "brown",
        background: "black",
    }),
    protectionDice: 1,
    protectionSides: 4,
    meleeBonus: 0,
    evasionBonus: -1,
    weight: 50,
    slotType: SLOT_BODY,
    itemType: IT_ARMOR,
    mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
});

Game.ItemRepository.define('bustersword', {
    name: "Buster Sword",
    glyph: new Game.Glyph({
        character: "|",
        foreground: "red",
        background: "black",
    }),
    meleeBonus: -2,
    evasionBonus: 1,
    damageDice: 3,
    damageSides: 5,
    weight: 70,
    slotType: SLOT_WEAPON,
    itemType: IT_SWORD,
    mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
});

Game.ItemRepository.define('curvedsword', {
    name: "Curved Sword",
    damageDice: 2,
    damageSides: 5,
    meleeBonus: -1,
    evasionBonus: 1,
    weight: 40,
    slotType: SLOT_WEAPON,
    itemType: IT_SWORD,
    hands: HANDS_1H,
    mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
});
