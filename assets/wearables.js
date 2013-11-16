Game.Mixins.Wearable = {
    name: "Wearable",
    groupName: "Wearable",
    init: function(properties) {
        var properties = properties || {};
        this.meleeBonus = properties.meleeBonus || 0;
        this.evasionBonus = properties.evasionBonus || 0;
        this._slotType = properties.slotType || null;
    },
    getSlotType: function() {
        return this._slotType;
    },
    isRealThing: function() {
        return this.getSlotType() != "SLOT_NULLOBJ";
    }
}

Game.Mixins.Weapon = {
    name: "Weapon",
    groupName: "Weapon",
    init: function(properties) {
        var properties = properties || {};
        this.damageDice = properties.damageDice || 0;
        this.damageSides = properties.damageSides || 0;
    },

    damroll: function(effectiveStrength) {
        effectiveStrength = effectiveStrength || 0;
        return Die.ndx(this.damageDice, this.damageSides + effectiveStrength);
    },

    computeSidesForStrength: function(str) {
        var absStr = Math.abs(str),
            strSign = str >= 0 ? 1 : -1,
            maxBonus = Math.floor(this.weight / 10),
            sidesDelta = strSign * Math.min(absStr, maxBonus);

        // All attacks must have at least one damage side. This is carried over
        // from Sil.
        return Math.max(1, this.damageSides + sidesDelta);
    }
}

Game.Mixins.Armor = {
    name: "Armor",
    groupName: "Armor",
    init: function(properties) {
        var properties = properties || {};
        this.protectionDice = properties.protectionDice || 0;
        this.protectionSides = properties.protectionSides || 0;
    }
}

Game.ItemRepository.define('fist', {
    name: "(none)",
    damageDice: 1,
    damageSides: 4,
    meleeBonus: 0,
    evasionBonus: 0,
    weight: 40, // Sil-style 4lb fists :>
    slotType: "SLOT_NULLOBJ",
    mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
});

Game.ItemRepository.define('skin', {
    name: "(none)",
    protectionDice: 0,
    protectionSides: 0,
    meleeBonus: 0,
    evasionBonus: 0,
    weight: 0,
    slotType: "SLOT_NULLOBJ",
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
    slotType: "SLOT_BODY",
    mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
});
