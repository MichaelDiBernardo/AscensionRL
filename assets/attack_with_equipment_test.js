// TODO: Check out why roll expectations aren't failing. (e.g. change last
// 1d8 to something else and it still passes.
(function() {
    var stubDie = function(rolls) {
        var die = new Die.FakeDie(rolls);
        sinon.stub(Die, "ndx", function(dieCount, sides) {
            return die.ndx(dieCount, sides);
        })
    },
        fakeRepo = new Game.EntityRepository();

    fakeRepo.define('shortsword', {
        damageDice: 1,
        damageSides: 7,
        meleeBonus: 0,
        evasionBonus: 1,
        weight: 10,
        slotType: SLOT_WEAPON,
        itemType: IT_SWORD,
        mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Weapon]
    });
    fakeRepo.define('leather', {
        protectionDice: 1,
        protectionSides: 6,
        meleeBonus: 0,
        evasionBonus: -2,
        weight: 50,
        slotType: SLOT_BODY,
        itemType: IT_ARMOR,
        mixins: [Game.Mixins.Item, Game.Mixins.Wearable, Game.Mixins.Armor]
    });

    var shortsword = fakeRepo.create('shortsword'),
        leathers = fakeRepo.create('leather'),
        equipment = new Game.Equipment([
            shortsword,
            leathers
        ]);

    module("attack-equipment", {
        teardown: function() {
            Die.ndx.restore();
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
            sheet: new Game.Sheet({
                equipment: equipment,
                stats: new Game.Stats({
                    str: 0,
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
            sheet: new Game.Sheet({
                equipment: equipment,
                stats: new Game.Stats({
                    str: 0,
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

    test("Standard equipment, one crit.", function() {
        // Die sequence:
        // A attack roll of 7
        // B evade roll of 0
        //
        // A is 4 dex + 0 melee + 7 = 11
        // B is 4 dex + 1 evasion sword - 2 armor + 0 = 3
        //
        // 11 - 3 = 8 = (7 base + 1 weapon weight), which is one crit.
        //
        // A should roll 2d7 damage, B rolls 1d6 prot.
        // Give 10 damage, 3 prot = 7 damage.
        var fighterTemplate = {
            glyph: new Game.Glyph({
                character: "@"
            }),
            sheet: new Game.Sheet({
                equipment: equipment,
                stats: new Game.Stats({
                    str: 0,
                    dex: 4,
                    con: 0,
                    gra: 3
                })
            }),
            mixins: [Game.Mixins.Fighter]
        },

            attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([7, 0, 10, 3], [null, null, [2, 7], null]);
        attacker.attack(defender);
        equal(defender.sheet().curHP(), defender.sheet().maxHP() - 7);
    });

    test("Standard equipment, mutiple crit.", function() {
        // Die sequence:
        // A attack roll of 15
        // B evade roll of 0
        //
        // A is 4 dex + 0 melee + 15 = 19
        // B is 4 dex + 1 evasion sword - 2 armor + 0 = 3
        //
        // 19 - 3 = 16 = 2 * (7 base + 1 weapon weight), which is two crits.
        //
        // A should roll 3d7 damage, B rolls 1d6 prot.
        // We don't even bother checking damage since it's the mock roll we're
        // most concerned about.
        var fighterTemplate = {
            glyph: new Game.Glyph({
                character: "@"
            }),
            sheet: new Game.Sheet({
                equipment: equipment,
                stats: new Game.Stats({
                    str: 0,
                    dex: 4,
                    con: 0,
                    gra: 3
                })
            }),
            mixins: [Game.Mixins.Fighter]
        },

            attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([15, 0, 10, 3], [null, null, [3, 7], null]);
        attacker.attack(defender);
        expect(0);
    });

    test("Standard equipment, add 1 damage side from str.", function() {
        // Die sequence:
        // A attack roll of 10
        // B evade roll of 10
        //
        // A is 4 dex + 0 melee + 10 = 14
        // B is 4 dex + 1 evasion sword - 2 armor + 10 = 13
        //
        // Obviously no crits.
        //
        // A has 1 str, should roll 1d8 damage.
        var fighterTemplate = {
            glyph: new Game.Glyph({
                character: "@"
            }),
            sheet: new Game.Sheet({
                equipment: equipment,
                stats: new Game.Stats({
                    str: 1,
                    dex: 4,
                    con: 0,
                    gra: 3
                })
            }),
            mixins: [Game.Mixins.Fighter]
        },

            attacker = new Game.Entity(fighterTemplate),
            defender = new Game.Entity(fighterTemplate);

        stubDie([10, 10, 6, 3], [null, null, [1, 8], null]);
        attacker.attack(defender);
        expect(0);
    });

})();
