import Player from './Player.js';
import Enemy from './Enemy.js';
import Object from './Object.js';
import Background from './Background.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.puntosPorObjeto = {
            object1: 20,
            object2: 30,
            object3: 50
        };
        this.puntosTotales = 0;
    }

    preload() {
        this.load.image('platform', './img/platform.png');
        this.load.image('enemie1', './img/enemigo-naranja.png');
        this.load.image('enemie2', './img/enemigo-morado.png');
        this.load.spritesheet('player', './img/player3.png', { frameWidth: 175, frameHeight: 175 });
        this.load.spritesheet('jump', './img/salto.png', { frameWidth: 175, frameHeight: 175 });
    }

    create() {
        this.background = new Background(this);
        this.player = new Player(this, 100, 200);
        this.enemies1 = this.physics.add.group();
        this.enemies2 = this.physics.add.group();
        this.objects = this.physics.add.group();

        this.createEnemies();
        this.createObjects();
        this.createPlatforms();

        this.scoreText = this.add.text(16, 16, 'Puntaje: 0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
        this.collisionText = this.add.text(0, 0, '', { fontSize: '20px', fill: '#fff' });
        this.collisionText.visible = false;

        this.physics.add.overlap(this.player.sprite, this.objects, this.collectObject, null, this);
        this.physics.add.overlap(this.player.sprite, this.enemies1, this.handleCollision, null, this);
        this.physics.add.overlap(this.player.sprite, this.enemies2, this.handleCollision, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createEnemies() {
        for (let i = 0; i < 2; i++) {
            new Enemy(this, 'enemie1', Phaser.Math.Between(300, 5900), 500);
            new Enemy(this, 'enemie2', Phaser.Math.Between(300, 5900), Phaser.Math.Between(100, 500));
        }
    }

    createObjects() {
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(300, 5900);
            const y = Phaser.Math.Between(100, 500);
            const objectType = Phaser.Math.Between(1, 3);
            const gameObject = new Object(this, `object${objectType}`, x, y);
            this.objects.add(gameObject.sprite);
        }
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        const platformPositions = [
            { x: 800, y: 520 }, { x: 1100, y: 520 }, { x: 1600, y: 370 },
            { x: 2100, y: 520 }, { x: 3500, y: 520 }, { x: 4500, y: 520 },
            { x: 4900, y: 380 }, { x: 5200, y: 380 }, { x: 5600, y: 200 }
        ];

        platformPositions.forEach(pos => {
            const adjustedY = pos.y * (window.innerHeight / 700);
            const platform = this.platforms.create(pos.x, adjustedY, 'platform').setScale(0.5).refreshBody();
            platform.setSize(300, 1);
        });

        this.physics.add.collider(this.player.sprite, this.platforms);
        this.physics.add.collider(this.objects, this.platforms);
        this.cameras.main.setBounds(0, 0, this.background.image.displayWidth, this.background.image.displayHeight);
        this.cameras.main.startFollow(this.player.sprite);
    }

    collectObject(player, object) {
        const puntosGanados = this.puntosPorObjeto[object.type];
        this.puntosTotales += puntosGanados;
        this.scoreText.setText('Puntaje: ' + this.puntosTotales);
        object.destroy();
        this.showCollisionMessage('¡Recogiste un dulce!');
    }

    showCollisionMessage(message) {
        this.collisionText.setText(message);
        this.collisionText.visible = true;
        this.time.delayedCall(1000, () => {
            this.collisionText.visible = false;
        });
    }

    handleCollision(player, enemy) {
        player.setPosition(100, 200);
        this.showCollisionMessage('¡Chocaste con un enemigo!');
    }

    update() {
        this.player.update(this.cursors);
        this.enemies1.children.iterate(enemy => enemy.update());
        this.enemies2.children.iterate(enemy => enemy.update());
    }
}
