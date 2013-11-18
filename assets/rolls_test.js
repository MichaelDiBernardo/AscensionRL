module("rolls");

test("Normal die roll values.", function() {
    var sut = new Die.Roll(1, 4);
    equal(sut.minValue(), 1);
    equal(sut.maxValue(), 4);
    equal(sut.toString(), "1d4");
});

test("Normal die roll.", function() {
    var mock = sinon.mock(),
        sut = new Die.Roll(1, 4, mock);

    mock.once().withExactArgs(1, 4).returns(3);
    equal(sut.roll(), 3);
    mock.verify();
});
