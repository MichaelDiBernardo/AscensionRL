Game.Sheet = function(properties) {
    var properties = properties || {}
    this._stats = properties.stats || new Game.Stats();
    this._skills = properties.skills || new Game.Skills();
    this._equipment = properties.equipment || new Game.Equipment();
    this._curHP = this.maxHP();
}

Game.Sheet.prototype.baseSkills = function() {
    return this._skills;
}

Game.Sheet.prototype.melee = function() {
    return this.baseSkills().melee() + this.meleeBonus();
}
Game.Sheet.prototype.ranged = function() {
    return this.baseSkills().ranged() + this.rangedBonus();
}
Game.Sheet.prototype.evasion = function() {
    return this.baseSkills().evasion() + this.evasionBonus();
}
Game.Sheet.prototype.will = function() {
    return this.baseSkills().will() + this.willBonus();
}
Game.Sheet.prototype.perception = function() {
    return this.baseSkills().perception() + this.perceptionBonus();
}
Game.Sheet.prototype.magic = function() {
    return this.baseSkills().magic() + this.magicBonus();
}

Game.Sheet.prototype.meleeBonus = function() {
    return this._stats.dex() + this._equipment.meleeBonus();
}
Game.Sheet.prototype.rangedBonus = function() {
    return this._stats.dex();
}
Game.Sheet.prototype.evasionBonus = function() {
    return this._stats.dex() + this._equipment.evasionBonus();
}
Game.Sheet.prototype.willBonus = function() {
    return this._stats.gra();
}
Game.Sheet.prototype.perceptionBonus = function() {
    return this._stats.gra();
}
Game.Sheet.prototype.magicBonus = function() {
    return this._stats.gra();
}

Game.Sheet.prototype.maxHP = function() {
    return this._stats.maxHP();
}

Game.Sheet.prototype.curHP = function() {
    return this._curHP;
}

Game.Sheet.prototype.setCurHP = function(amt) {
    this._curHP = amt;
}

Game.Sheet.prototype.criticalInterval = function() {
    return 7 + this._equipment.getWeapon().getWeightInLbs();
}

// TODO: Damroll and protectionRoll should both return Roll objects.
Game.Sheet.prototype.damroll = function(residual, accumulator) {
    // TODO: This can't be right. Critical interval should be opponent's, not
    // the attackers.
    var numCrits = Math.floor(residual / this.criticalInterval()),
        weapon = this._equipment.getWeapon(),
        damageDice = weapon.damageDice + numCrits,
        damageSides = weapon.computeSidesForStrength(this._stats.str()),
        roll = new Die.Roll(damageDice, damageSides);

    // TODO: Maybe we need a "reportDamroll" here or something.
    if (accumulator) {
        accumulator.numCrits = numCrits;
        accumulator.damageRoll = roll;
    }

    return roll.roll();
}
Game.Sheet.prototype.protectionRoll = function() {
    return this._equipment.protectionRoll();
}
