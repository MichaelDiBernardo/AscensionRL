Game.EntityRepository = function() {
    this._templates = {};
}

Game.EntityRepository.prototype.define = function(entityTag, template) {
    this._templates[entityTag] = template;
}

Game.EntityRepository.prototype.create = function(entityTag) {
    if ( !(entityTag in this._templates) ) {
        throw "Key %s missing from repo.".format(entityTag);
    }

    var template = Object.create(this._templates[entityTag]);
    return new Game.Entity(template);
}
