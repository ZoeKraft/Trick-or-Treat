export default class GameObject {
    constructor(scene, type, x, y) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, type);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.scale = 0.5;
    }
}
