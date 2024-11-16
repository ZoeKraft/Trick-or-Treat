export default class Camera {
    constructor(scene, playerSprite) {
        this.scene = scene;
        this.playerSprite = playerSprite;
        this.createCamera();
    }

    createCamera() {
        this.scene.cameras.main.setBounds(0, 0, this.scene.background.displayWidth, this.scene.background.displayHeight);
        this.scene.cameras.main.startFollow(this.playerSprite);
    }
}
