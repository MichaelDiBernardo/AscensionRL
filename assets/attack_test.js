(function() {
    var oldDie = Die.ndx,
        FakeDie = Die.FakeDie;
        stubDie = function(rolls) {
            Die = new FakeDie(rolls);
        },
        restoreDie = function() {
            Die = {};
            Die.ndx = oldDie;
        };

    module("attack", {
        teardown: function() {
            restoreDie();
        }
    });

    test("Test two naked skilless dudes punching each other and missing", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 10
        // No other rolls made -- it's a miss.

        var fighterTemplate = {
            equipment: new Game.Equipment(),
            sheet: new Game.Sheet(),
            mixins: [Game.Mixins.Fighter]
        },

            attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([10, 10]);
        attacker.attack(defender);
        equal(defender.sheet().curHP(), defender.sheet().maxHP());
    });

    test("Test two naked skilless dudes punching each other and hitting", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 9
        // Rolls 1d4 damage (2) vs 0d0 protection (0) for a total of 2 damage.
        var fighterTemplate = {
            equipment: new Game.Equipment(),
            sheet: new Game.Sheet(),
            mixins: [Game.Mixins.Fighter]
        };

        var attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([10, 9, 2, 0]);
        attacker.attack(defender);
        equal(18, defender.sheet().curHP());
    });

    test("Punching an armored dude for damage", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 9
        // Rolls 1d4 damage (2) vs 1d4 protection (1) for a total of 1 damage.
        var fighterTemplate = {
            equipment: new Game.Equipment({
                armor: Game.Armor.Leather
            }),
            sheet: new Game.Sheet(),
            mixins: [Game.Mixins.Fighter]
        };

        var attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([10, 9, 2, 1]);
        attacker.attack(defender);
        equal(19, defender.sheet().curHP());
    });

    test("Attacking and hitting with real melee and evasion", function() {
        // Die sequence:
        // A attack roll of 1 (+ 9 melee score)
        // B evade roll of 2 (+ 4 evasion score)
        // Rolls 1d4 damage (2) vs 0d0 protection (0) for a total of 2 damage.
        var fighterTemplate = {
            equipment: new Game.Equipment(),
            sheet: new Game.Sheet({
                skills: new Game.Skills({
                    melee: 9,
                    evasion: 4
                })
            }),
            mixins: [Game.Mixins.Fighter]
        };

        var attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([1, 2, 2, 0]);
        attacker.attack(defender);
        equal(18, defender.sheet().curHP());
    });

    test("Attacking and missing with real melee and evasion", function() {
        // Die sequence:
        // A attack roll of 1 (+ 9 melee score)
        // B evade roll of 6 (+ 4 evasion score)
        // Miss: No damage.
        var fighterTemplate = {
            equipment: new Game.Equipment(),
            sheet: new Game.Sheet({
                skills: new Game.Skills({
                    melee: 9,
                    evasion: 4
                })
            }),
            mixins: [Game.Mixins.Fighter]
        };

        var attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([1, 6]);
        attacker.attack(defender);
        equal(defender.sheet().curHP(), defender.sheet().maxHP());
    });
})();
