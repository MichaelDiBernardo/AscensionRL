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

Die.Roll.prototype.roll = function() {
    return this._provider(this._die, this._sides);
}

Die.AggregateRoll = function(rolls, provider) {
    this._rolls = rolls;
    this._provider = provider || null;
}

Die.AggregateRoll.prototype.minValue = function() {
    // Argh, might install lodash for reduce.
    var toReturn = 0,
        length = this._rolls.length;

    for (var i = 0; i < length; i++) {
        toReturn += this._rolls[i].minValue();
    }

    return toReturn;
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

    return total;
}
