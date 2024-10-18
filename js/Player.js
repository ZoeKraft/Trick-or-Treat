export default class Player {
    constructor(scene, x, y, key) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, key);
        this.sprite.setGravityY(500);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.scale = 0.8;

        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            yoyo: true,
            repeat: -1
        });
        this.sprite.anims.play('walk');
        this.sprite.canJump = true;
    }

    update(cursors) {
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-300);
            if (this.sprite.body.onFloor()) {
                this.sprite.anims.play('walk', true);
            }
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(300);
            if (this.sprite.body.onFloor()) {
                this.sprite.anims.play('walk', true);
            }
        } else {
            this.sprite.setVelocityX(0);
            if (this.sprite.body.onFloor()) {
                this.sprite.anims.stop();
            }
        }

        if (cursors.up.isDown && this.sprite.body.onFloor() && this.sprite.canJump) {
            this.sprite.setVelocityY(-590);
            this.sprite.canJump = false;
            this.sprite.anims.play('jump');
        }

        if (this.sprite.body.onFloor()) {
            this.sprite.canJump = true;
        }
    }
}
