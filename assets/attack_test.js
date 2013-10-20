T.AttackTest = {}

T.AttackTest.FighterTemplate = {
    curHP: 20,
    maxHP: 20,
    mixins: [Game.Mixins.Fighter]
}

T.AttackTest.attacker = new Game.Entity(T.AttackTest.FighterTemplate);
T.AttackTest.defender = new Game.Entity(T.AttackTest.FighterTemplate);

test("Test simple attack", function() {
    T.AttackTest.attacker.attack(T.AttackTest.defender);
    equal(T.AttackTest.defender.curHP(), 19);
});
