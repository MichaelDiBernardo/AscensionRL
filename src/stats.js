Game.Stats = function(properties) {
    properties = properties || {};
    this._str = properties.str || 0;
    this._dex = properties.dex || 0;
    this._con = properties.con || 0;
    this._gra = properties.gra || 0;
};

Game.Stats.prototype.str = function() {
    return this._str;
};

Game.Stats.prototype.dex = function() {
    return this._dex;
};

Game.Stats.prototype.con = function() {
    return this._con;
};

Game.Stats.prototype.gra = function() {
    return this._gra;
};

Game.Stats.prototype.maxHP = function() {
    return Math.floor(20 * Math.pow(1.2, this.con()));
};
