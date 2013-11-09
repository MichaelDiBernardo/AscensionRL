Game.Message = {};

Game.Message.Channel = {
    STATUS: "status",
    COMBAT: "combat"
};

Game.Message.MessageRouter = function() {
    this._channelMap = {};
    this.clearMessages();
}

Game.Message.MessageRouter.prototype.sendMessage = function(channel, message) {
    this._channelMap[channel].push(message);
}

Game.Message.MessageRouter.prototype.selectMessage = function(
        channel, targetEntity, playerTargetMessage, otherTargetMessage) {
    if (targetEntity.hasMixin('PlayerActor')) {
        this.sendMessage(channel, playerTargetMessage);
    } else {
        this.sendMessage(channel, otherTargetMessage);
    }
}

Game.Message.MessageRouter.prototype.getMessages = function(channel) {
    return this._channelMap[channel];
}

Game.Message.MessageRouter.prototype.clearMessages = function() {
    for (var channel in Game.Message.Channel) {
        var channelVal = Game.Message.Channel[channel];
        this._channelMap[channelVal] = [];
    }
}

Game.Message.CombatRollAccumulator = function(properties) {
    properties = properties || {};
    this.meleeRoll = properties.meleeRoll || 0;
    this.evasionRoll = properties.evasionRoll || 0;
    this.attacker = properties.attacker || null;
    this.defender = properties.defender || null;
    this.hit = properties.hit || false;
    this.damageDice = properties.damageDice || 0;
    this.damageSides = properties.damageSides || 0;
    this.damageRoll = properties.damageRoll || 0;
    this.protectionRoll = properties.protectionRoll || 0;
    this.damage = properties.damage || 0;
    this.numCrits = properties.numCrits || 0;
}

Game.Message.CombatRollAccumulator.prototype.buildCombatRollMessage = function() {
    var forceSign = function(num) {
        if (num >= 0) {
            return "+" + num;
        } else {
            return "" + num;
        }
    },
        message = "%s (%s) -> %s (%s) %s <- [%s] %s".format(
            this.attacker.getGlyph().getChar(),
            forceSign(this.attacker.sheet().melee()),
            this.meleeRoll,
            forceSign(this.meleeRoll - this.evasionRoll),
            this.evasionRoll,
            forceSign(this.defender.sheet().evasion()),
            this.defender.getGlyph().getChar()
    );

    var damageString = "" + this.damageDice + "d" + this.damageSides,
        protectionRange = this.attacker.sheet().protectionRange(),
        protectionString = "%s-%s".format(protectionRange[0], protectionRange[1]);

    if (this.hit) {
        message += "; %s (%s) -> %s (%s) %s <- [%s] %s".format(
            this.attacker.getGlyph().getChar(),
            damageString,
            this.damageRoll,
            this.damage,
            this.protectionRoll,
            protectionString,
            this.defender.getGlyph().getChar()
        );
    }
    return message;
}

Game.Message.CombatRollAccumulator.prototype.buildCritSuffix = function() {
    if (this.numCrits == 0) {
        return ".";
    }

    var suffix = "";
    for (var i = 0; i < this.numCrits; i++) {
        suffix += "!";
    }
    return suffix;
}

Game.Message.Router = new Game.Message.MessageRouter();
