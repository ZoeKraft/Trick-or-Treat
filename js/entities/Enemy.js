export default class Enemy {
    constructor(scene, x, y, texture, direction, speed, range, isVertical = false) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.scale = 0.15;
        this.direction = direction; 
        this.speed = speed;
        this.range = range; 
        this.isVertical = isVertical;
        this.sprite.setOffset(0, 0);
        this.sprite.setSize(410, 410); 
        this.updateVelocity();
    }

    updateVelocity() {
        if (this.isVertical) {
            this.sprite.body.setVelocityY(this.direction * this.speed);
        } else {
            this.sprite.body.setVelocityX(this.direction * this.speed);
        }
    }

    update() {
        if (this.isVertical) {
            if (this.sprite.y <= this.range.min) {
                this.direction = 1; 
            } else if (this.sprite.y >= this.range.max) {
                this.direction = -1; 
            }
        } else {
            if (this.sprite.x <= this.range.min) {
                this.direction = 1; 
            } else if (this.sprite.x >= this.range.max) {
                this.direction = -1; 
            }
        }
        this.updateVelocity();
    }
}
