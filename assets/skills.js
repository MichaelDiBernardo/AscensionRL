Game.Skills = function(stats, properties) {
    this._stats = stats;

    var properties = properties || {};
    this._melee = properties['baseMelee'] || 0;
    this._ranged = properties['baseRanged'] || 0;
    this._evasion = properties['baseEvasion'] || 0;
    this._will = properties['baseWill'] || 0;
    this._perception = properties['basePerception'] || 0;
    this._magic = properties['baseMagic'] || 0;
};

Game.Skills.prototype.melee = function() {
    return this._melee + this.meleeBonus();
};
Game.Skills.prototype.ranged = function() {
    return this._ranged + this.rangedBonus();
};
Game.Skills.prototype.evasion = function() {
    return this._evasion + this.evasionBonus();
};
Game.Skills.prototype.will = function() {
    return this._will + this.willBonus();
};
Game.Skills.prototype.perception = function() {
    return this._perception + this.perceptionBonus();
};
Game.Skills.prototype.magic = function() {
    return this._magic + this.magicBonus();
};

Game.Skills.prototype.baseMelee = function() {
    return this._melee;
};
Game.Skills.prototype.baseRanged = function() {
    return this._ranged;
};
Game.Skills.prototype.baseEvasion = function() {
    return this._evasion;
};
Game.Skills.prototype.baseWill = function() {
    return this._will;
};
Game.Skills.prototype.basePerception = function() {
    return this._perception;
};
Game.Skills.prototype.baseMagic = function() {
    return this._magic;
};

Game.Skills.prototype.meleeBonus = function() {
    return this._stats.dex();
};
Game.Skills.prototype.rangedBonus = function() {
    return this._stats.dex();
};
Game.Skills.prototype.evasionBonus = function() {
    return this._stats.dex();
};
Game.Skills.prototype.willBonus = function() {
    return this._stats.gra();
};
Game.Skills.prototype.perceptionBonus = function() {
    return this._stats.gra();
};
Game.Skills.prototype.magicBonus = function() {
    return this._stats.gra();
};
