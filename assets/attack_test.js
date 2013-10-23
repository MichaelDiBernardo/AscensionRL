
(function() {
    var oldDie = Die.ndx;
    var FakeDie = Die.FakeDie;

    var stubDie = function(rolls) {
        Die = new FakeDie(rolls);
    };

    var restoreDie = function() {
        Die = {};
        Die.ndx = oldDie;
    };

    var attacker;
    var defender;

    module("attack", {
        setup: function() {
            var fighterTemplate = {
                equipment: new Game.Equipment(),
                sheet: new Game.Sheet(),
                mixins: [Game.Mixins.Fighter]
            };

            attacker = new Game.Entity(fighterTemplate);
            defender = new Game.Entity(fighterTemplate);
        },
        teardown: function() {
            restoreDie();
        }
    });

    test("Test two naked skilless dudes punching each other and missing", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 10
        // No other rolls made -- it's a miss.
        // TODO: Make a test where they actually hit so that there's some code to break.
        stubDie([10, 10]);
        attacker.attack(defender);
        equal(defender.sheet().curHP(), defender.sheet().maxHP());
    });

    test("Test two naked skilless dudes punching each other and hitting", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 9
        // Rolls 1d4 damage (2) vs 0d0 protection (0) for a total of 2 damage.
        stubDie([10, 9, 2, 0]);
        attacker.attack(defender);
        equal(18, defender.sheet().curHP());
    });
})();
