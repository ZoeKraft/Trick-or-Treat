export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Crear el sprite del jugador
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        this.sprite.setGravityY(500);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.scale = 0.8; // Asegúrate de que este valor sea adecuado
        this.sprite.canJump = true;
        this.sprite.setDepth(1); // Asegúrate de que el jugador esté por delante
        this.sprite.setOffset(0, 0); // mover la hitbox en X e Y
        this.sprite.setSize(80, 150); // para redimencionar la hitbox
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
            frames: this.scene.anims.generateFrameNumbers('jump', { start: 0, end: 3 }), // Asegúrate de que los índices sean correctos
            frameRate: 5,
            hideOnComplete: true
        });

        this.sprite.anims.play('walk'); // Jugar la animación de caminar
    }

    update(cursors) {
        // Movimiento horizontal
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-300);
            if (this.sprite.body.onFloor()) {
                this.sprite.flipX = true;
                this.sprite.anims.play('walk', true);
            }
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(300);
            if (this.sprite.body.onFloor()) {
                this.sprite.flipX = false;

                this.sprite.anims.play('walk', true);
            }
        } else {
            this.sprite.setVelocityX(0);
            if (this.sprite.body.onFloor()) {
                this.sprite.anims.stop();
            }
        }

        // Saltar
        if (cursors.up.isDown && this.sprite.body.onFloor() && this.sprite.canJump) {
            this.sprite.setVelocityY(-790);
            this.sprite.canJump = false;
            this.sprite.anims.play('jump');
        }

        // Permitir el salto cuando el jugador está en el suelo
        if (this.sprite.body.onFloor()) {
            this.sprite.canJump = true;
            // Asegúrate de que la animación de caminar se esté deteniendo correctamente
            if (this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key !== 'walk') {
                this.sprite.anims.play('walk', true);
            }
        }

        // Asegúrate de que el sprite sea visible
        this.sprite.visible = true;
    }
}
