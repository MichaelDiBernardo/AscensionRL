Game.Skills = function(properties) {
    var properties = properties || {};
    this._melee = properties.melee || 0;
    this._ranged = properties.ranged || 0;
    this._evasion = properties.evasion || 0;
    this._will = properties.will || 0;
    this._perception = properties.perception || 0;
    this._magic = properties.magic || 0;
};

Game.Skills.prototype.melee = function() {
    return this._melee;
};
Game.Skills.prototype.ranged = function() {
    return this._ranged;
};
Game.Skills.prototype.evasion = function() {
    return this._evasion;
};
Game.Skills.prototype.will = function() {
    return this._will;
};
Game.Skills.prototype.perception = function() {
    return this._perception;
};
Game.Skills.prototype.magic = function() {
    return this._magic;
};
