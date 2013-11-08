Game.Equipment = function(properties) {
    properties = properties || {};
    this.weapon = properties.weapon || Game.Weapon.Fist;
    this.armor = properties.armor || Game.Armor.Skin;
};

Game.Equipment.prototype.protection = function() {
    return [
        this.armor.protectionDice,
        this.armor.protectionDice * this.armor.protectionSides
    ];
};

Game.Equipment.prototype.protectionRoll = function() {
    return Die.ndx(this.armor.protectionDice, this.armor.protectionSides);
};

Game.Equipment.prototype.protectionRange = function() {
    // TODO: This will change once we have multiple armor equips.
    return [
        this.armor.protectionDice,
        this.armor.protectionDice * this.armor.protectionSides
    ];
};
