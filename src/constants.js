/**
 * Item types.
 */
iota.start();
IT_NULLOBJ = iota.val();
IT_SHIELD = iota.val();
IT_SWORD = iota.val();
IT_AXE = iota.val();
IT_POLEARM = iota.val();
IT_ARMOR = iota.val();
IT_GLOVES = iota.val();
IT_HELM = iota.val();

/**
 * Equipment slot types
 */
iota.start(-1);
SLOT_ANY = iota.val();
SLOT_WEAPON = iota.val();
SLOT_RANGED = iota.val();
SLOT_LEFT_RING = iota.val();
SLOT_RIGHT_RING = iota.val();
SLOT_AMULET = iota.val();
SLOT_LIGHT = iota.val();
SLOT_BODY = iota.val();
SLOT_CLOAK = iota.val();
SLOT_OFFHAND = iota.val();
SLOT_HELM = iota.val();
SLOT_GLOVES = iota.val();
SLOT_BOOTS = iota.val();

/**
 * Handedness for weapons.
 */
iota.start();
HANDS_1H = iota.val();
HANDS_15H = iota.val();
HANDS_2H = iota.val();

/**
 * Inventory stuff.
 */
INV_CAPACITY = 23;
