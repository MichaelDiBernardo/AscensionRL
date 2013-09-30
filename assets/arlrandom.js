/**
 * Gets a uniform int in the closed interval [from, to].
 */
ROT.RNG.getUniformInt = function(from, to) {
    return Math.floor(ROT.RNG.getUniform() * (to - from + 1) + from);
};

/**
 * Rolls dieCount sides-sided die and returns the sum.
 */
var ndx = function(dieCount, sides) {
    var sum = 0;
    for (var i = 0; i < dieCount; i++) {
        sum += ROT.RNG.getUniformInt(1, sides);
    }
    return sum;
};
