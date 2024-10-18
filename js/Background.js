export default class Background {
    constructor(scene, x, y, key) {
        this.scene = scene;
        this.sprite = this.scene.add.image(x, y, key).setOrigin(0, 0).setDisplaySize(6200, window.innerHeight);
        this.scene.physics.world.setBounds(0, 0, this.sprite.displayWidth, this.sprite.displayHeight - 30);
    }
}
