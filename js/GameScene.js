import Background from './Background.js';
import Player from './Player.js';
import Enemy from './Enemy.js';
import GameObject from './GameObject.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
        this.cursors = null;
    }

    preload() {
        this.load.image('background', './img/background1.png');
        this.load.image('platform', './img/platform.png');
        this.load.image('object1', './img/sweet1.png');
        this.load.image('object2', './img/sweet2.png');
        this.load.image('object3', './img/sweet3.png');
        this.load.image('enemie1', './img/enemigo-naranja.png');
        this.load.image('enemie2', './img/enemigo-morado.png');
        this.load.spritesheet('player', './img/player3.png', { frameWidth: 175, frameHeight: 175 });
        this.load.spritesheet('jump', './img/salto.png', { frameWidth: 175, frameHeight: 175 });
    }

    create() {
        this.background = new Background(this, 0, 0, 'background');
        this.player = new Player(this, 40, 40, 'player');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.enemies = [];
        for (let i = 0; i < 3; i++) {
            this.enemies.push(new Enemy(this, 'enemie1', Phaser.Math.Between(300, 5900), 500));
            this.enemies.push(new Enemy(this, 'enemie2', Phaser.Math.Between(300, 5900), Phaser.Math.Between(100, 500)));
        }

        this.objects = [];
        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(300, 5900);
            let y = Phaser.Math.Between(100, 500);
            let type = `object${Phaser.Math.Between(1, 3)}`;
            this.objects.push(new GameObject(this, type, x, y));
        }
    }

    update() {
        this.player.update(this.cursors);
        this.enemies.forEach(enemy => enemy.update());
    }
}
