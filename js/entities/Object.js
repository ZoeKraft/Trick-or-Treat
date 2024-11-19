export default class GameObject {
    static puntosPorObjeto = {
        popsicle: 20,
        candy: 30,
        bar: 50
    };

    constructor(scene, x, y, type, scale) {
        this.scene = scene;
        this.type = type;
        this.points = this.getPoints(type);
        this.sprite = this.scene.physics.add.sprite(x, y, type);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setScale(scale * 0.5); 
        this.sprite.setOffset(0, 0);
        this.sprite.setSize(100 * scale, 100 * scale); 
        this.scene.physics.add.overlap(this.scene.player.sprite, this.sprite, this.collect, null, this);
    }

    getPoints(type) {
        return GameObject.puntosPorObjeto[type] || 0;
    }

    collect(player, object) {
        const puntosGanados = this.getPoints(this.type);
        this.scene.puntosTotales += puntosGanados;
        this.scene.scoreText.setText('Points: ' + this.scene.puntosTotales);
        object.destroy();
        const inventoryItem = { name: this.type, imageKey: this.type };
        this.scene.inventory.addItem(inventoryItem);
    }
    
    destroy() {
        this.sprite.destroy();
    }
}
