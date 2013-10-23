Game.Weapon = function(damageDice, damageSides) {
    this.damageDice = damageDice;
    this.damageSides = damageSides;
};

Game.Weapon.Fist = new Game.Weapon(1, 0);

Game.Armor = function(protDice, protSides) {
    this.protDice = protDice;
    this.protSides = protSides;
};

Game.Armor.Skin = new Game.Armor(0, 0);
