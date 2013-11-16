Game.Equipment = function(properties) {
    properties = properties || {};
    this.weapon = properties.weapon || Game.ItemRepository.create('fist');
    this.armor = properties.armor || Game.ItemRepository.create('skin');
}

Game.Equipment.prototype.protection = function() {
    return [
        this.armor.protectionDice,
        this.armor.protectionDice * this.armor.protectionSides
    ];
}

Game.Equipment.prototype.protectionRoll = function() {
    return Die.ndx(this.armor.protectionDice, this.armor.protectionSides);
}

Game.Equipment.prototype.protectionRange = function() {
    // TODO: This will change once we have multiple armor equips.
    return [
        this.armor.protectionDice,
        this.armor.protectionDice * this.armor.protectionSides
    ];
}

Game.Equipment.prototype.meleeBonus = function() {
    return this.weapon.meleeBonus + this.armor.meleeBonus;
}

Game.Equipment.prototype.evasionBonus = function() {
    return this.weapon.evasionBonus + this.armor.evasionBonus;
}
