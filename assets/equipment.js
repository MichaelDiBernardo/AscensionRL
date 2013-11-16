Game.Equipment = function(properties) {
    properties = properties || {};
    this._weapon = properties.weapon || Game.ItemRepository.create('fist');
    this._armor = properties.armor || Game.ItemRepository.create('skin');
}

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
