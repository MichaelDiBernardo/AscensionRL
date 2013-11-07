Game.Weapon = function(damageDice, damageSides) {
    this.damageDice = damageDice;
    this.damageSides = damageSides;
}

Game.Weapon.prototype.damroll = function(effectiveStrength) {
    effectiveStrength = effectiveStrength || 0;
    return Die.ndx(this.damageDice, this.damageSides + effectiveStrength);
}

Game.Weapon.Fist = new Game.Weapon(1, 4);

Game.Armor = function(protDice, protSides) {
    this.protDice = protDice;
    this.protSides = protSides;
}

Game.Armor.Skin = new Game.Armor(0, 0);

Game.Armor.Leather = new Game.Armor(1, 4);
