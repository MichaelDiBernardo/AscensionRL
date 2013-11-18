module("rolls");

test("Normal die roll values.", function() {
    var sut = new Die.Roll(1, 4);
    equal(sut.minValue(), 1);
    equal(sut.maxValue(), 4);
    equal(sut.toString(), "1d4");
});
