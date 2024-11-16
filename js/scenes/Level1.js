import Camera from "./Camera.js";
import Platforms from "./Platforms.js";
import Goal from "./Goal.js";

import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";
import GameObject from "../entities/Object.js";

import Pause from "../utils/Pause.js";
import Inventory from "../utils/Inventory.js";

export default class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });

        // scene properties
        this.puntosTotales = 0;
        this.bg = null;
        this.player = null;
        this.platforms = null;
        this.enemies1 = [];
        this.enemies2 = [];
        this.objects = [];
        this.goal = null;
        this.scoreText = null;
        this.pause = null;
        this.camera = null;
        this.cursors = null;
        this.spacebar = null;
        this.inventory = null;
    }

    preload() {
        this.load.image('background', './img/background1.png');
        this.load.image('platform', './img/platform.png');
        this.load.image('popsicle', './img/sweet1.png');
        this.load.image('candy', './img/sweet2.png');
        this.load.image('bar', './img/sweet3.png');
        this.load.image('enemie1', './img/enemigo-naranja.png');
        this.load.image('enemie2', './img/enemigo-morado.png');
        this.load.image('pauseButton', './img/pause.png');
        this.load.image('playButton', './img/play.png');
        this.load.image('pauseBackground', './img/pausedBackground.png');
        this.load.image('goal', './img/goal.png');
        this.load.image('inventory', './img/inventory.png');
        this.load.image('shield', './img/shield1.png');

        //animations
        this.load.spritesheet('player', './img/player.png', {
            frameWidth: 175,
            frameHeight: 175,
            margin: -1,
            spacing: -1
        });

        this.load.spritesheet('jump', './img/juump.png', {
            frameWidth: 175,
            frameHeight: 175,
            margin: 0,
            spacing: 0
        });

        // Load json file for level 1
        this.load.json('levelData1', './data/levelData1.json');
    }


    create() {

        //Background
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.setDisplaySize(6200, window.innerHeight);
        this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight - 30);


        //Player
        this.player = new Player(this, 100, 200);
        this.physics.add.collider(this.player.sprite, this.platforms);


        //Enemies
        this.enemies1 = [];
        for (let i = 0; i < 3; i++) {
            let x = Phaser.Math.Between(300, 5900);
            this.enemies1.push(new Enemy(this, x, 500, 'enemie1', 1, 200, { min: x - 300, max: x + 300 }));
        }

        this.enemies2 = [];
        for (let i = 0; i < 3; i++) {
            let y = Phaser.Math.Between(100, 500);
            let x = Phaser.Math.Between(300, 5900);
            this.enemies2.push(new Enemy(this, x, y, 'enemie2', 1, 100, { min: y - 150, max: y + 150 }, true));
        }


        //level 1
        this.goal = new Goal(this, 6050, 600, 'Level2');  


        // Platforms
        this.platforms = new Platforms(this, 'levelData1'); 
        this.physics.add.collider(this.player.sprite, this.platforms);


        //Objects
        this.objects = [];
        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(300, 5900);
            let y = Phaser.Math.Between(100, 500);
            let objectType = Phaser.Math.Between(1, 3) === 1 ? 'popsicle' : (Phaser.Math.Between(1, 3) === 2 ? 'candy' : 'bar');
            this.objects.push(new GameObject(this, x, y, objectType));
        }

        //Score
        this.scoreText = this.add.text(16, 16, 'Points: 0', {
            fontSize: '32px',
            fill: '#fff'
        }).setScrollFactor(0);

        //Pause
        this.pause = new Pause(this);

        //Cursor
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Camera
        this.camera = new Camera(this, this.player.sprite);

        //Enemy colision
        this.enemies1.forEach(enemy => {
            this.physics.add.overlap(this.player.sprite, enemy.sprite, (player, enemy) => {
                if (this.player.shieldActive) {
                    if (this.player.sprite && enemy && enemy.sprite) {
                        enemy.destroy();
                        this.showCollisionMessage('¡Escudo activado!');
                    }
                } else {
                    this.restartGame();
                }
            }, null, this);
        });

        this.enemies2.forEach(enemy => {
            this.physics.add.overlap(this.player.sprite, enemy.sprite, (player, enemy) => {
                if (this.player.shieldActive) {
                    if (this.player.sprite && enemy && enemy.sprite) {
                        enemy.destroy();
                        this.showCollisionMessage('¡Escudo activado!');
                    }
                } else {
                    this.restartGame();
                }
            }, null, this);
        });

        //Inventory
        this.inventory = new Inventory(this);
    }

    // restartGame function
    restartGame() {
        const collisionText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "!GAME OVER¡", {
            fontSize: '40px',
            fill: '#fff'
        }).setOrigin(0.5);

        collisionText.setScrollFactor(0);

        this.time.delayedCall(1000, () => {
            collisionText.destroy();
            this.scene.restart();
        });
    }

    // colision message
    showCollisionMessage(message) {
        const collisionText = this.add.text(this.player.sprite.x, this.player.sprite.y - 100, message, { fontSize: '20px', fill: '#fff' });
        this.time.delayedCall(1000, () => {
            collisionText.destroy(); 
        });
    }

    update() {
        if (!this.pause.isPaused) { 
           
            this.player.update(this.cursors, this.spacebar);

            this.enemies1.forEach(enemy => enemy.update());
            this.enemies2.forEach(enemy => enemy.update());
        }
    }
}


