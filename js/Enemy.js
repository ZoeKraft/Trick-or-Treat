export default class Enemy {
    constructor(scene, type, x, y) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, type);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.scale = 0.15;
        this.direction = 1;
        this.speed = 200;
        this.range = { min: x - 300, max: x + 300 };
        this.scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocityX(this.direction * this.speed);
    }

    update() {
        if (this.sprite.x <= this.range.min || this.sprite.x >= this.range.max) {
            this.direction *= -1;
            this.sprite.body.setVelocityX(this.direction * this.speed);
        }
    }
}
