(function() {
    var sut = null;

    module("messagerouter", {
        setup: function() {
            sut = new Game.Message.MessageRouter();
        }
    });

    test("Basic status message and retrieval", function() {
        var testMessage = "Hi!";
        sut.sendMessage(Game.Message.STATUS, testMessage);

        var msgs = sut.getMessages(Game.Message.STATUS);

        equal(1, msgs.length);
        equal(testMessage, msgs[0]);
    });

})();
