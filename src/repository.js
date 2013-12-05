Game.EntityRepository = function() {
    this._templates = {};
};

Game.EntityRepository.prototype.define = function(entityTag, template) {
    this._templates[entityTag] = template;
};

Game.EntityRepository.prototype.create = function(entityTag) {
    if ( !(entityTag in this._templates) ) {
        throw "Key %s missing from repo.".format(entityTag);
    }

    var template = Object.create(this._templates[entityTag]);
    return new Game.Entity(template);
};

/**
 * util / debug for now.
 */
Game.EntityRepository.prototype.createRandom = function() {
    var randomKey = _.keys(this._templates).random(),
        template = Object.create(this._templates[randomKey]);
    if (template.generate !== undefined && !template.generate) {
        return this.createRandom();
    }
    return new Game.Entity(template);
};
