// Define our Moveable mixin
Game.Mixins.Moveable = {
    name: "Moveable",
    groupName: "Moveable",
    tryMove: function(x, y, map) {
        var currentTile = map.getTileAt(this._x, this._y),
            targetTile = map.getTileAt(x, y);

        // Should we hit something?
        if (targetTile.isOccupied()) {
            // We don't bother checking if this is also fighter, because
            // nothing moves that doesn't also attack so far.
            var other = targetTile.getOccupant(),
                isAttackable = other.hasMixin('Fighter'),
                areOpposed = other.hasMixin('PlayerActor') || this.hasMixin('PlayerActor');
            if (!isAttackable || !areOpposed) return false;

            this.attack(other);
            return false;
        }

        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (targetTile.isWalkable()) {
            // Update the entity's position
            this._x = x;
            this._y = y;
            currentTile.onEntityExited(this);
            targetTile.onEntityEntered(this);
            return true;
        }

        Game.Message.Router.selectMessage(
            Game.Message.Channel.STATUS,
            this,
            "There is a wall in the way!",
            ""
        );
        return false;
    }
};

Game.Mixins.PlayerActor = {
    name: "PlayerActor",
    groupName: "Actor",
    act: function() {
        Game.refresh();
        // Lock the engine and wait asynchronously for the player to press
        // a key.
        this.getLevel().getEngine().lock();
    }
};

Game.Mixins.WanderingActor = {
    name: "WanderingActor",
    groupName: "Actor",
    act: function() {
        this.wander();
    },
    wander: function() {
        var moveX = [true, false].random(),
            delta = [1, -1].random(),
            newX = this.getX() + (moveX ? delta : 0),
            newY = this.getY() + (moveX ? 0 : delta);

        this.tryMove(newX, newY, this.getLevel());
    }
};

Game.Mixins.Fighter = {
    name: "Fighter",
    groupName: "Fighter",
    init: function(properties) {
        properties = properties || {};
        this._sheet = properties.sheet || new Game.Sheet();
    },

    sheet: function() {
        return this._sheet;
    },

    attack: function(defender) {
        var meleeRoll = this.sheet().melee() + Die.ndx(1, 20),
            evasionRoll = defender.sheet().evasion() + Die.ndx(1, 20),
            residual = meleeRoll - evasionRoll,
            accumulator = new Game.Message.CombatRollAccumulator({
                attacker: this,
                defender: defender,
                meleeRoll: meleeRoll,
                evasionRoll: evasionRoll
            });


        if (residual <= 0) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You miss the %s.".format(defender.getName()),
                "The %s misses you.".format(this.getName())
            );
            accumulator.hit = false;
        } else {
            accumulator.hit = true;

            var damageRoll = this.sheet().damroll(residual, accumulator),
                damageValue = damageRoll.roll(),
                critSuffix = accumulator.buildCritSuffix();
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You hit the %s%s".format(defender.getName(), critSuffix),
                "The %s hits you%s".format(this.getName(), critSuffix)
            );
            defender.hurt(damageValue, this, accumulator);
        }
        Game.Message.Router.sendMessage(
            Game.Message.Channel.COMBAT,
            accumulator.buildCombatRollMessage()
        );
    },

    hurt: function(hp, attacker, accumulator) {
        var protectionRoll = this.sheet().protectionRoll(),
            protectionValue = protectionRoll.roll(),
            damage = Math.max(0, hp - protectionValue);
        accumulator.protectionRoll = protectionRoll;
        accumulator.damage = damage;

        this.sheet().setCurHP(this.sheet().curHP() - damage);
        if (this.sheet().curHP() <= 0) {
            this.onDeath(attacker);
        }
    },

    // TODO: There are enough of these now that we should just have a generic
    // event raising thing that other classes can extend.
    onDeath: function(killer) {
        if (killer) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You die.",
                "You have slain the %s.".format(this.getName())
            );
        } else {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You die.",
                "It dies."
            );
        }
        this.getLevel().removeEntity(this);
        if (this.hasMixin("PlayerActor")) {
            Game.switchScreen(Game.Screen.deathScreen);
        }
    }
};

Game.Mixins.ItemHolder = {
    name: "ItemHolder",
    groupName: "ItemHolder",
    init: function(properties) {
        properties = properties || {};
        this._inventory = properties.inventory || new Game.Inventory();
    },

    getInventory: function() {
        return this._inventory;
    },

    getItemOnFloor: function() {
        var tile = this.getTileBeneath(),
            item = tile.getTopItem();
        if (item === null) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "Nothing to pick up!",
                ""
            );
            return false;
        }

        var itemName = item.getOneliner();

        if (this._inventory.isFull()) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You have no room for the %s.".format(itemName),
                "The %s has no room to pick up a %s.".format(this.getName(), item.getName())
            );
            return false;
        }

        tile.removeTopItem();
        this._inventory.addItem(item);

        Game.Message.Router.selectMessage(
            Game.Message.Channel.STATUS,
            this,
            "You get %s.".format(itemName),
            "The %s gets a %s.".format(this.getName(), item.getName())
        );
        return true;
    },

    dropItemOnFloor: function(slotLetter) {
        var tile = this.getTileBeneath(),
            item = this._inventory.removeItemBySlot(slotLetter);

        if (!item) {
            Game.Message.Router.sendMessage(
                Game.Message.Channel.STATUS,
                "No such item."
            );
            return;
        }

        Game.Message.Router.selectMessage(
            Game.Message.Channel.STATUS,
            this,
            "You drop the %s".format(item.getOneliner()),
            "The %s drops the %s".format(this.getName(), item.getOneliner())
        );

        tile.placeItem(item);
    }
};

/**
 * Requires InventoryHolder and Fighter as other mixins.
 **/
Game.Mixins.Equipper = {
    name: "Equipper",
    groupName: "Equipper",
    init: function(properties) {
    },
    equipFromSlot: function(slotLetter) {
        var inventory = this.getInventory(),
            equipment = this.sheet().getEquipment(),
            itemToEquip = null;

        try {
            itemToEquip = inventory.getItemBySlot(slotLetter);
        } catch (e) {
            Game.Message.Router.sendMessage(
                Game.Message.Channel.STATUS,
                "No such item."
            );
            return false;
        }

        inventory.removeItemBySlot(slotLetter);
        var displaced = equipment.equip(itemToEquip),
            leftOvers = inventory.addItemsUntilFull(displaced);

        _.forEach(displaced, function(wearable) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You remove %s.".format(wearable.getOneliner()),
                "The %s removes %s.".format(this.getName(), wearable.getOneliner())
            );
        }, this);

        // We need the floor tile! For now just obliterate.
        _.forEach(leftOvers, function(w) {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You have nowhere to put %s! You drop it.".format(w.getOneliner()),
                "The %s has nowhere to put %s! It falls to the floor.".format(this.getName(), w.getOneliner())
            );

            this.dropItemOnFloor(w);
        }, this);

        Game.Message.Router.selectMessage(
            Game.Message.Channel.STATUS,
            this,
            "You equip %s.".format(itemToEquip.getOneliner()),
            "The %s equips %s.".format(this.getName(), itemToEquip.getOneliner())
        );

        return true;
    },
    unequipFromSlot: function(slotLetter) {
        var inventory = this.getInventory(),
            equipment = this.sheet().getEquipment(),
            removedEquip = equipment.unequipItemBySlotLetter(slotLetter);

        if (removedEquip === null) {
            eame.Message.Router.sendMessage(
                Game.Message.Channel.STATUS,
                "Nothing to unequip from that slot."
            );
            return;
        }

        Game.Message.Router.selectMessage(
            Game.Message.Channel.STATUS,
            this,
            "You remove %s".format(removedEquip.getOneliner()),
            "The %s removes %s".format(this.getName(), removedEquip.getOneliner())
        );

        if (inventory.roomLeft()) {
            inventory.addItem(removedEquip);
        } else {
            Game.Message.Router.selectMessage(
                Game.Message.Channel.STATUS,
                this,
                "You have nowhere to put %s! You drop it.".format(removedEquip.getOneliner()),
                "The %s has nowhere to put %s! It falls to the floor.".format(this.getName(), removedEquip.getOneliner())
            );

            this.dropItemOnFloor(removedEquip);
        }
    },
    dropItemOnFloor: function(item) {
        Game.Message.Router.sendMessage(
            Game.Message.Channel.STATUS,
            "The %s disappears into the ether.".format(item.getOneliner())
        );
    }
};

Game.DudeRepository = new Game.EntityRepository();

Game.DudeRepository.define('player', {
    name: "Player",
    glyph: new Game.Glyph({
        character: "@",
        foreground: "white",
        background: "black",
    }),
    sheet: new Game.Sheet({
        skills: new Game.Skills({
            melee: 3,
            evasion: 3
        }),
        stats: new Game.Stats({
            str: 2,
            dex: 4,
            con: 5,
            gra: 3
        }),
        equipment: new Game.Equipment([
            Game.ItemRepository.create('bustersword'),
            Game.ItemRepository.create('leather')
        ]),
    }),
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor, Game.Mixins.Fighter, Game.Mixins.ItemHolder, Game.Mixins.Equipper]
});

Game.DudeRepository.define('orc', {
    name: "Orc",
    glyph: new Game.Glyph({
        character: "o",
        foreground: "green",
        background: "black"
    }),
    sheet: new Game.Sheet({
        skills: new Game.Skills({
            melee: 3
        }),
        equipment: new Game.Equipment([
            Game.ItemRepository.create('curvedsword')
        ]),
    }),
    mixins: [Game.Mixins.Moveable, Game.Mixins.WanderingActor, Game.Mixins.Fighter]
});

Game.DudeRepository.define('pinkpony', {
    name: "Pink Pony",
    glyph: new Game.Glyph({
        character: "p",
        foreground: "magenta",
        background: "black"
    }),
    sheet: new Game.Sheet({
        skills: new Game.Skills({
            melee: 1,
            evasion: 3
        }),
        equipment: new Game.Equipment([
            Game.ItemRepository.create('bustersword')
        ]),
    }),
    mixins: [Game.Mixins.Moveable, Game.Mixins.WanderingActor, Game.Mixins.Fighter]
});
