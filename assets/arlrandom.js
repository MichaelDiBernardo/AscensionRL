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

// This thing has sort of evolved to become a "situational mock", but too lazy
// to change name.
Die.FakeDie = function(rolls, verifications) {
    this._rolls = rolls;
    this._verifications = verifications;
    this._i = 0;
}

Die.FakeDie.prototype.ndx = function(dieCount, sides) {
    if (this._verifications) {
        var dieSpec = this._verifications[this._i];
        if (dieSpec && (dieSpec[0] != dieCount || dieSpec[1] != sides)) {
            var expectedDie = "" + dieSpec[0] + "d" + dieSpec[1],
                actualDie = "" + dieCount + "d" + sides;
            throw "Unexpected die: expected %s, actual %s".format(
                    expectedDie, actualDie);
        }
    }

    var toReturn = this._rolls[this._i];
    this._i++;
    return toReturn;
}
