Die.Roll = function(die, sides, provider) {
    this._die = die;
    this._sides = sides;
    this._lastValue = null;
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

Die.Roll.prototype.roll = function() {
    this._lastValue = this._provider(this._die, this._sides);
    return this._lastValue;
}

Die.Roll.prototype.getLastValue = function() {
    if (this._lastValue === null) {
        throw new Error("This die was never rolled.");
    }
    return this._lastValue;
}

Die.AggregateRoll = function(rolls, provider) {
    this._rolls = rolls || [];
    this._lastValue = null;
    this._provider = provider || null;
}

Die.AggregateRoll.prototype.addRoll = function(roll) {
    this._rolls.push(roll);
}

Die.AggregateRoll.prototype.minValue = function() {
    return _.reduce(
        _.map(this._rolls, function(r) { return r.minValue(); }),
        function(s, n) { return s + n; },
        0
    );
}

Die.AggregateRoll.prototype.maxValue = function() {
    var toReturn = 0,
        length = this._rolls.length;

    for (var i = 0; i < length; i++) {
        toReturn += this._rolls[i].maxValue();
    }

    return toReturn;
}

Die.AggregateRoll.prototype.toString = function() {
    return "[%s-%s]".format(this.minValue(), this.maxValue());
}

Die.AggregateRoll.prototype.roll = function() {
    var total = 0,
        length = this._rolls.length;

    for (var i = 0; i < length; i++) {
        var roll = this._rolls[i];
        // TODO: Mega hack for testing -- must be better way.
        if (this._provider) {
            roll._provider = this._provider;
        }
        total += roll.roll();
    }

    this._lastValue = total;
    return total;
}

Die.AggregateRoll.prototype.getLastValue = Die.Roll.prototype.getLastValue;
