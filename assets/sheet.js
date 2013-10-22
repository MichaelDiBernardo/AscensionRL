Game.Sheet = function(properties) {
    var properties = properties || {};
    this._stats = properties['stats'] || new Stats();
    this._skills = properties['skills'] || new Skills();
};

Game.Sheet.prototype.baseSkills = function() {
    return this._skills;
};

Game.Sheet.prototype.melee = function() {
    return this.baseSkills().melee() + this.meleeBonus();
};
Game.Sheet.prototype.ranged = function() {
    return this.baseSkills().ranged() + this.rangedBonus();
};
Game.Sheet.prototype.evasion = function() {
    return this.baseSkills().evasion() + this.evasionBonus();
};
Game.Sheet.prototype.will = function() {
    return this.baseSkills().will() + this.willBonus();
};
Game.Sheet.prototype.perception = function() {
    return this.baseSkills().perception() + this.perceptionBonus();
};
Game.Sheet.prototype.magic = function() {
    return this.baseSkills().magic() + this.magicBonus();
};

Game.Sheet.prototype.meleeBonus = function() {
    return this._stats.dex();
};
Game.Sheet.prototype.rangedBonus = function() {
    return this._stats.dex();
};
Game.Sheet.prototype.evasionBonus = function() {
    return this._stats.dex();
};
Game.Sheet.prototype.willBonus = function() {
    return this._stats.gra();
};
Game.Sheet.prototype.perceptionBonus = function() {
    return this._stats.gra();
};
Game.Sheet.prototype.magicBonus = function() {
    return this._stats.gra();
};

Game.Sheet.prototype.maxHP = function() {
    return this._stats.maxHP();
};
