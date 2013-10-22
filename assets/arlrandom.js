/**
 * Gets a uniform int in the closed interval [from, to].
 */
ROT.RNG.getUniformInt = function(from, to) {
    return Math.floor(ROT.RNG.getUniform() * (to - from + 1) + from);
};

/**
 * Rolls dieCount sides-sided die and returns the sum.
 */
var Die = {};
Die.ndx = function(dieCount, sides) {
    var sum = 0;
    for (var i = 0; i < dieCount; i++) {
        sum += ROT.RNG.getUniformInt(1, sides);
    }
    return sum;
}

Die.FakeDie = function(rolls) {
    this._rolls = rolls;
    this._i = 0;
}

Die.FakeDie.prototype.ndx = function(dieCount, sides) {
    var toReturn = this._rolls[this._i];
    this._i++;
    return toReturn;
}
