(function() {
    var sut = null;

    module("messagerouter", {
        setup: function() {
            sut = new Game.Message.MessageRouter();
        }
    });

    test("Basic status message and retrieval", function() {
        var testMessage = "Hi!";
        sut.sendMessage(Game.Message.Channel.STATUS, testMessage);

        var msgs = sut.getMessages(Game.Message.Channel.STATUS);

        equal(1, msgs.length);
        equal(testMessage, msgs[0]);
    });

    test("Send to various channels", function() {
        sut.sendMessage(Game.Message.Channel.STATUS, "1");
        sut.sendMessage(Game.Message.Channel.COMBAT, "2");
        sut.sendMessage(Game.Message.Channel.STATUS, "3");
        sut.sendMessage(Game.Message.Channel.COMBAT, "4");

        var statusMsgs = sut.getMessages(Game.Message.Channel.STATUS);
        equal(2, statusMsgs.length);
        equal("1", statusMsgs[0]);
        equal("3", statusMsgs[1]);

        var combatMsgs = sut.getMessages(Game.Message.Channel.COMBAT);
        equal(2, combatMsgs.length);
        equal("2", combatMsgs[0]);
        equal("4", combatMsgs[1]);
    });

    test("Clear messages on all channels", function() {
        for (var i = 0; i < 4; i++) {
            sut.sendMessage(Game.Message.Channel.STATUS, "" + i);
            sut.sendMessage(Game.Message.Channel.COMBAT, "" + i);
        }

        equal(4, sut.getMessages(Game.Message.Channel.STATUS).length);
        equal(4, sut.getMessages(Game.Message.Channel.COMBAT).length);

        sut.clearMessages();

        equal(0, sut.getMessages(Game.Message.Channel.STATUS).length);
        equal(0, sut.getMessages(Game.Message.Channel.COMBAT).length);

    });

    test("Select message: Is player", function() {
        var player = new Game.Entity(Game.PlayerTemplate);
        sut.selectMessage(
            Game.Message.Channel.STATUS,
            player,
            "PlayerMessage",
            "NotPlayerMessage"
        );

        equal("PlayerMessage", sut.getMessages(Game.Message.Channel.STATUS)[0]);
    });

    test("Select message: Is not player", function() {
        var notPlayer = new Game.Entity(Game.OrcTemplate);
        sut.selectMessage(
            Game.Message.Channel.STATUS,
            notPlayer,
            "PlayerMessage",
            "NotPlayerMessage"
        );

        equal("NotPlayerMessage", sut.getMessages(Game.Message.Channel.STATUS)[0]);
    });

})();
