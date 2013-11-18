Die.Roll = function(die, sides, provider) {
    this._die = die;
    this._sides = sides;
    this._provider = provider || Die.ndx;
}

Die.Roll.prototype.minValue = function() {
    return this._die;
}

Die.Roll.prototype.maxValue = function() {
    return this._die * this._sides;
}

Die.Roll.prototype.toString = function() {
    return "" + this._die + "d" + this._sides;
}


//Die.Roll.AggregateDieRoll = function(rolls) {
//    this._rolls;
//    this._provider = provider || Die.ndx;
//}
//
//Die.Roll.DieRoll.prototype.minValue = function() {
//    return this._die;
//}
//
//Die.Roll.DieRoll.prototype.maxValue = function() {
//    return this._die * this._sides;
//}
//
//Die.Roll.DieRoll.prototype.toString = function() {
//    return "" + this._die + "d" + this._sides;
//}
