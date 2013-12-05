Utils = {};

Utils.alphabet = "abcdefghijklmnopqrstuvwxyz";

Utils.Iota = function() {
    this.ctr = 0;
};

Utils.Iota.prototype.val = function() {
    var toReturn = this.ctr;
    this.ctr++;
    return toReturn;
};

Utils.Iota.prototype.start = function(val) {
    if (val !== undefined) {
        this.ctr = val;
    } else {
        this.ctr = 0;
    }
};

iota = new Utils.Iota();
