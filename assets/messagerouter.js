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

Game.Message.Router = new Game.Message.MessageRouter();
