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

        // Propiedades del escudo
        this.shieldActive = false;
        this.shieldTime = 0;
        this.shieldCooldown = 2000; 
        this.shield = this.scene.add.image(this.sprite.x, this.sprite.y, 'shield').setOrigin(0.5).setAlpha(0);
        this.shield.setScale(0.8);
        this.shield.setDepth(this.sprite.depth + 1); 

        // Crear animaciones
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
            hideOnComplete: true, 
        });


        this.sprite.anims.play('walk');
        this.isJumping = false;
        this.isLanding = false; 
    }

    update(cursors, spacebar) {
        // Movimiento 
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-300);
            this.sprite.flipX = true;
            if (!this.isJumping) this.sprite.anims.play('walk', true);
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(300);
            this.sprite.flipX = false;
            if (!this.isJumping) this.sprite.anims.play('walk', true);
        } else {
            this.sprite.setVelocityX(0);
            if (this.sprite.body.onFloor() && !this.isJumping && !this.isLanding) {
                this.sprite.anims.stop();
            }
        }

        // Saltar
        if (cursors.up.isDown && this.sprite.body.onFloor() && this.sprite.canJump) {
            this.sprite.setVelocityY(-790);
            this.sprite.canJump = false;
            this.isJumping = true;
            this.isLanding = false; 
            this.sprite.anims.play('jump');

            // Esperar a que termine la animación de salto
            this.sprite.once('animationcomplete', (animation) => {
                if (animation.key === 'jump') {
                    this.isJumping = false;
                    this.scene.time.delayedCall(100, () => {
                        if (this.sprite.body.onFloor()) {
                            this.isLanding = false;
                            this.sprite.anims.play('walk', true);
                        }
                    });
                }
            });
        }

        // Activar el escudo
        if (spacebar.isDown && !this.shieldActive && this.scene.time.now > this.shieldTime + this.shieldCooldown) {
            this.activateShield();
        }

        // Mantener el escudo activo durante un tiempo determinado
        if (this.shieldActive && this.scene.time.now > this.shieldTime + this.shieldCooldown) {
            this.deactivateShield();
        }

        // Actualizar la posición del escudo
        if (this.shieldActive) {
            this.shield.setPosition(this.sprite.x, this.sprite.y);
        }

        // Permitir el salto cuando el jugador está en el suelo
        if (this.sprite.body.onFloor()) {
            this.sprite.canJump = true;
            if (!this.isJumping && !this.isLanding) {
                this.sprite.anims.play('walk', true);
            }
        }
        this.sprite.visible = true;
    }

    // Función para activar el escudo
    activateShield() {
        this.shieldActive = true;
        this.shieldTime = this.scene.time.now;
        this.shield.setAlpha(1); 
    }

    // Función para desactivar el escudo
    deactivateShield() {
        this.shieldActive = false;
        this.shield.setAlpha(0); 
    }
}
