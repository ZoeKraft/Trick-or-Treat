export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        this.sprite.setGravityY(500);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.scale = 0.8;
        this.sprite.canJump = true;
        this.sprite.setDepth(1);
        this.sprite.setOffset(0, 0);
        this.sprite.setSize(80, 150);

        this.shieldActive = false;
        this.shieldTime = 0;
        this.shieldCooldown = 2000;
        this.shield = this.scene.add.image(this.sprite.x, this.sprite.y, 'shield').setOrigin(0.5).setAlpha(0);
        this.shield.setScale(0.8);
        this.shield.setDepth(this.sprite.depth + 1);

        // Base speed and joystick-related factors
        this.baseSpeed = 300;
        this.joystickSpeedFactor = 0.6;
        this.joystickJumpFactor = 0.7;

        // Animations
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            yoyo: true,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNumbers('jump', { start: 0, end: 4 }),
            frameRate: 6,
            hideOnComplete: false,
        });

        this.sprite.anims.play('walk');
        this.isJumping = false;
        this.isLanding = false;
    }

    update(cursors, spacebar, joystick = null) {
        let velocityX = 0;
        let isJoystickActive = joystick && (joystick.getDirection().x !== 0 || joystick.getDirection().y !== 0);

        // Movement
        if (isJoystickActive) {
            velocityX = joystick.getDirection().x * this.baseSpeed * this.joystickSpeedFactor;
            this.sprite.flipX = joystick.getDirection().x < 0;
        } else if (cursors.left.isDown) {
            velocityX = -this.baseSpeed;
            this.sprite.flipX = true;
        } else if (cursors.right.isDown) {
            velocityX = this.baseSpeed;
            this.sprite.flipX = false;
        }

        this.sprite.setVelocityX(velocityX);

        // Walking animation
        if (velocityX !== 0 && this.sprite.body.onFloor() && !this.isJumping) {
            this.sprite.anims.play('walk', true);
        } else if (this.sprite.body.onFloor() && !this.isJumping && !this.isLanding) {
            this.sprite.anims.stop();
        }

        // Jumping logic
        if (
            (cursors.up.isDown || (isJoystickActive && joystick.getDirection().y < -0.5)) &&
            this.sprite.body.onFloor() &&
            this.sprite.canJump
        ) {
            const jumpForce = isJoystickActive
                ? -890 * this.joystickJumpFactor // joystick jump
                : -790; // regular jump

            this.sprite.setVelocityY(jumpForce);
            this.sprite.canJump = false;
            this.isJumping = true;
            this.isLanding = false;
            this.sprite.anims.play('jump');
            this.sprite.setSize(80, 150); 
            this.sprite.setOffset(0, 0);

            // Animation complete logic
            this.sprite.once('animationcomplete', (animation) => {
                if (animation.key === 'jump') {
                    this.isJumping = false;
                    this.sprite.setSize(80, 150);
                    this.sprite.setOffset(0, 0); 

                    this.scene.time.delayedCall(100, () => {
                        if (this.sprite.body.onFloor()) {
                            this.isLanding = false;
                            this.sprite.anims.play('walk', true);
                        }
                    });
                }
            });
        }

        // Power button (shield activation)
        if (joystick && joystick.isPowerPressed() && !this.shieldActive && this.scene.time.now > this.shieldTime + this.shieldCooldown) {
            this.activateShield();
        }

        // Deactivate shield if cooldown is over
        if (this.shieldActive && this.scene.time.now > this.shieldTime + this.shieldCooldown) {
            this.deactivateShield();
        }

        // Update shield position
        if (this.shieldActive) {
            this.shield.setPosition(this.sprite.x, this.sprite.y);
        }

        // Landing logic
        if (this.sprite.body.onFloor()) {
            this.sprite.canJump = true;
            if (!this.isJumping && !this.isLanding) {
                this.sprite.anims.play('walk', true);
            }
        }
    }

    activateShield() {
        this.shieldActive = true;
        this.shieldTime = this.scene.time.now;
        this.shield.setAlpha(1);
    }

    deactivateShield() {
        this.shieldActive = false;
        this.shield.setAlpha(0);
    }
}
