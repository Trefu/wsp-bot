const {
    Personajes
} = require("./models")

class player {
    constructor(owner, name) {
        this.owner = owner,
            this.name = name,
            this.hitpoints = hitpoints,
            this.maxHitpoints = maxHitpoints,
            this.exp = exp || 0,
            this.level = level || 1,
            this.clase = clase,
            this.ca = ca || 10
    }
    mostrarpj() {
        return this.owner, this.pcName, this.hitpoints
    }
    takeDamage(dmg) {
        this.hitpoints -= dmg
        if (hitpoints <= 0) this.hitpoints = 0;
        return this.hitpoints;
    }
    init() {
        console.log(Personajes)

    }
}

module.exports.player = player;