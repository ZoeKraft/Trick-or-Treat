export default class Background extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.setOrigin(0, 0); // Establecer origen en la esquina superior izquierda
    }
}
