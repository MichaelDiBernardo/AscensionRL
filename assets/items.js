Game.Weapon = function(properties) {
    var properties = properties || {};
    this.damageDice = properties.damageDice || 0;
    this.damageSides = properties.damageSides || 0;
    this.meleeBonus = properties.meleeBonus || 0;
    this.evasionBonus = properties.evasionBonus || 0;
    this.weight = properties.weight || 1;
}

Game.Weapon.prototype.damroll = function(effectiveStrength) {
    effectiveStrength = effectiveStrength || 0;
    return Die.ndx(this.damageDice, this.damageSides + effectiveStrength);
}

Game.Weapon.prototype.computeSidesForStrength = function(str) {
    var maxBonus = Math.floor(this.weight / 10);
    return this.damageSides + Math.min(str, maxBonus);
}


Game.Weapon.Fist = new Game.Weapon({
    damageDice: 1,
    damageSides: 4,
    meleeBonus: 0,
    evasionBonus: 0,
    weight: 40 // Sil-style 4lb fists :>
});

Game.Armor = function(properties) {
    var properties = properties || {};
    this.protectionDice = properties.protectionDice || 0;
    this.protectionSides = properties.protectionSides || 0;
    this.meleeBonus = properties.meleeBonus || 0;
    this.evasionBonus = properties.evasionBonus || 0;
    this.weight = properties.weight || 1;
}

Game.Armor.Skin = new Game.Armor({
    protectionDice: 0,
    protectionSides: 0,
    meleeBonus: 0,
    evasionBonus: 0,
    weight: 0
});

Game.Armor.Leather = new Game.Armor({
    protectionDice: 1,
    protectionSides: 4,
    meleeBonus: 0,
    evasionBonus: -1,
    weight: 50
});
