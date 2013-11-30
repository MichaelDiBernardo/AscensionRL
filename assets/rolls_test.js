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

test("Aggregate die roll values.", function() {
    var sut = new Die.AggregateRoll([
            new Die.Roll(1, 4),
            new Die.Roll(1, 2),
            new Die.Roll(2, 4)
        ]);

    equal(sut.minValue(), 4);
    equal(sut.maxValue(), 14);
    equal(sut.toString(), "[4-14]");
});

test("Aggregate die roll.", function() {
    var mock = sinon.mock(),
        sut = new Die.AggregateRoll([
            new Die.Roll(1, 4),
            new Die.Roll(1, 2),
            new Die.Roll(2, 4)
        ], mock);

    mock.exactly(3).returns(1);
    equal(sut.roll(), 3);
    mock.verify();
});

test("Die rolls are cached.", function() {
    var mock = sinon.mock(),
        sut = new Die.Roll(1, 4, mock);

    mock.once().returns(3);
    equal(sut.roll(), 3);
    equal(sut.getLastValue(), 3);
    mock.verify();
});

test("Last roll rases if called before rolling.", function() {
    var sut = new Die.Roll(1, 4);

    throws(
        function() {
            sut.getLastValue();
        },
        "No exception raised for getting value of unrolled die."
    );
});

test("Aggregate die rolls are cached.", function() {
    var mock = sinon.mock(),
        sut = new Die.AggregateRoll([
            new Die.Roll(1, 4),
            new Die.Roll(1, 2),
            new Die.Roll(2, 4)
        ], mock);

    mock.exactly(3).returns(1);
    equal(sut.roll(), 3);
    equal(sut.getLastValue(), 3);
    mock.verify();
});

test("Last aggregate roll rases if called before rolling.", function() {
    var sut = new Die.AggregateRoll();

    throws(
        function() {
            sut.getLastValue();
        },
        "No exception raised for getting value of unrolled die."
    );
});
