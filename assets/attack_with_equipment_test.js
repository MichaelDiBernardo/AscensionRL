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
        shortsword = new Game.Weapon({
            damageDice: 1,
            damageSides: 7,
            meleeBonus: 0,
            evasionBonus: 1,
            weight: 10
        }),
        leathers = new Game.Armor({
            protectionDice: 1,
            protectionSides: 6,
            meleeBonus: 0,
            evasionBonus: -2,
            weight: 50
        }),
        equipment = new Game.Equipment({
            weapon: shortsword,
            armor: leathers
        });

    module("attack-equipment", {
        teardown: function() {
            restoreDie();
        }
    });

    test("Standard equipment, miss.", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 11
        //
        // A is 4 dex + 0 melee + 10 = 14
        // B is 4 dex + 1 evasion sword - 2 armor + 11 = 14
        // No other rolls made -- it's a miss.


        var fighterTemplate = {
            glyph: new Game.Glyph({
                character: "@"
            }),
            equipment: equipment,
            sheet: new Game.Sheet({
                stats: new Game.Stats({
                    str: 2,
                    dex: 4,
                    con: 0,
                    gra: 3
                })
            }),
            mixins: [Game.Mixins.Fighter]
        },

            attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([10, 11]);
        attacker.attack(defender);
        equal(defender.sheet().curHP(), defender.sheet().maxHP());
    });

    test("Standard equipment, hit.", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 10
        //
        // A is 4 dex + 0 melee + 10 = 14
        // B is 4 dex + 1 evasion sword - 2 armor + 10 = 13
        //
        // A should roll 1d7 damage, B rolls 1d6 prot.
        // Give 4 damage, 3 prot = 1 damage.


        var fighterTemplate = {
            glyph: new Game.Glyph({
                character: "@"
            }),
            equipment: equipment,
            sheet: new Game.Sheet({
                stats: new Game.Stats({
                    str: 2,
                    dex: 4,
                    con: 0,
                    gra: 3
                })
            }),
            mixins: [Game.Mixins.Fighter]
        },

            attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([10, 10, 4, 3]);
        attacker.attack(defender);
        equal(defender.sheet().curHP(), defender.sheet().maxHP() - 1);
    });

})();
