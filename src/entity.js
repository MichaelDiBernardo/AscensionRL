Game.Entity = function(properties) {
    properties = properties || {};
    // Call the glyph"s constructor with our set of properties
    // Instantiate any properties from the passed object
    this._name = properties.name || "";
    this._x = properties.x || 0;
    this._y = properties.y || 0;
    this._glyph = properties.glyph || Game.Glyph.NullGlyph;
    this._level = null;

    // Create an object which will keep track what mixins we have
    // attached to this entity based on the name property
    this._attachedMixins = {};
    // Create a similar object for groups
    this._attachedMixinGroups = {};
    // Setup the object"s mixins
    var mixins = properties.mixins || [],
        length = mixins.length;
    for (var i = 0; i < length; i++) {
        var mixin = mixins[i];

        // Copy over all properties from each mixin as long
        // as it"s not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
        for (var key in mixin) {
            if (key != "init" && key != "name" && !this.hasOwnProperty(key)) {
                this[key] = mixin[key];
            }
        }
        // Add the name of this mixin to our attached mixins
        this._attachedMixins[mixin.name] = true;
        // If a group name is present, add it
        if (mixin.groupName) {
            this._attachedMixinGroups[mixin.groupName] = true;
        }
        // Finally call the init function if there is one
        if (mixin.init) {
            mixin.init.call(this, properties);
        }
    }
}

Game.Entity.prototype.setName = function(name) {
    this._name = name;
}
Game.Entity.prototype.setX = function(x) {
    this._x = x;
}
Game.Entity.prototype.setY = function(y) {
    this._y = y;
}
Game.Entity.prototype.getName = function() {
    return this._name;
}
Game.Entity.prototype.getX = function() {
    return this._x;
}
Game.Entity.prototype.getY   = function() {
    return this._y;
}
Game.Entity.prototype.getGlyph = function() {
    return this._glyph;
}
Game.Entity.prototype.hasMixin = function(obj) {
    // Allow passing the mixin itself or the name / group name as a string
    if (typeof obj === "object") {
        return this._attachedMixins[obj.name];
    } else {
        return this._attachedMixins[obj] || this._attachedMixinGroups[obj];
    }
}
Game.Entity.prototype.setLevel = function(level) {
    this._level = level;
}
Game.Entity.prototype.getLevel = function() {
    return this._level;
}
