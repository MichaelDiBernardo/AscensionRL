Game.Equipment = function(properties) {
    properties = properties || {};
    this.weapon = properties.weapon || Game.Weapon.Fist;
    this.armor = properties.armor || Game.Armor.Skin;
};

Game.Equipment.prototype.protection = function() {
    return [this.armor.protDice, this.armor.protDice * this.armor.protSides];
};
