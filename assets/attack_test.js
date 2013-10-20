(function() {
    var attacker;
    var defender;

    module("attack", {
        setup: function() {
            var fighterTemplate = {
                curHP: 20,
                maxHP: 20,
                mixins: [Game.Mixins.Fighter]
            };

            attacker = new Game.Entity(fighterTemplate);
            defender = new Game.Entity(fighterTemplate);
        }
    });

    test("Test simple attack", function() {
        attacker.attack(defender);
        equal(defender.curHP(), 19);
    });

    module();
})();
