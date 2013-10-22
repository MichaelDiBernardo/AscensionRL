var __oldDie = Die.ndx;
var stubDie = function(rolls) {
    Die = new Die.FakeDie(rolls);
};

var restoreDie = function() {
    Die = {};
    Die.ndx = __oldDie;
};

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
        },
        teardown: function() {
            restoreDie();
        }
    });

    test("Test simple attack", function() {
        attacker.attack(defender);
        equal(defender.curHP(), 19);
    });

    test("Test simple foo", function() {
        ok(true);
    });
})();
