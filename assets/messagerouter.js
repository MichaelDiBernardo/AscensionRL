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
    this.damageRoll = properties.damageRoll || 0;
    this.protectionRoll = properties.protectionRoll || 0;
    this.damage = properties.damage || 0;
}

Game.Message.CombatRollAccumulator.prototype.buildCombatRollMessage = function(properties) {
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

    if (this.hit) {
        message += "; %s -> %s (%s) %s <- %s".format(
            this.attacker.getGlyph().getChar(),
            this.damageRoll,
            this.damage,
            this.protectionRoll,
            this.defender.getGlyph().getChar()
        );
    }
    return message;
}

Game.Message.Router = new Game.Message.MessageRouter();
