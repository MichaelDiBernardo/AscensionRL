Game.Message = {
    STATUS: "status",
    COMBAT: "combat"
};

Game.Message.MessageRouter = function() {
    var channelMap = {};
    channelMap[Game.Message.STATUS] = [];
    channelMap[Game.Message.COMBAT] = [];
    this._channelMap = channelMap;
}

Game.Message.MessageRouter.prototype.sendMessage = function(channel, message) {
    this._channelMap[channel].push(message);
}

Game.Message.MessageRouter.prototype.getMessages = function(channel) {
    return this._channelMap[channel];
}

Game.Message.Router = new Game.Message.MessageRouter();
