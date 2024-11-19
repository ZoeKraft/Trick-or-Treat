import Camera from "./Camera.js";
import Platforms from "./Platforms.js";
import Goal from "./Goal.js";

import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";
import GameObject from "../entities/Object.js";

import Pause from "../utils/Pause.js";
import Inventory from "../utils/Inventory.js";
import Joystick from "../utils/Joystick.js";

export default class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3' });

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
        this.joystick = null;
        this.isMobile = false;
    }

    preload() {
        this.load.image('background3', './img/background3.jpg');
        this.load.image('platform3', './img/plataform3.png');
        this.load.image('popsicle', './img/sweet1.png');
        this.load.image('candy', './img/sweet2.png');
        this.load.image('bar', './img/sweet3.png');
        this.load.image('enemie1', './img/enemigo-naranja.png');
        this.load.image('enemie2', './img/enemigo-morado.png');
        this.load.image('pauseButton', './img/pause.png');
        this.load.image('playButton', './img/play.png');
        this.load.image('goal3', './img/goal3.png');
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

        // Load json file level3
        this.load.json('levelData3', './data/levelData3.json');
    }

    create() {
        // Detect if the device is mobile
        this.isMobile = this.sys.game.device.input.touch || window.innerWidth < 768;


        // Dimensiones originales
        const originalBackgroundWidth = 6300;
        const originalBackgroundHeight = 720;

        // Obtener las dimensiones de la ventana
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const scale = Math.max(windowWidth / originalBackgroundWidth, windowHeight / originalBackgroundHeight);

        //Background
        this.background = this.add.image(0, 0, 'background3').setOrigin(0, 0);
        this.background.setDisplaySize(originalBackgroundWidth * scale, originalBackgroundHeight * scale);
        this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight - 25);

        let textoBienvenida = this.add.text(500, 200, '¡Bienvenido al Nivel 3!', { fontSize: '40px', fill: '#ff0' });
        this.time.delayedCall(2000, () => {
            textoBienvenida.destroy();
        });


        //Player
        this.player = new Player(this, 100, 200);
        this.player.sprite.setScale(scale);
        this.physics.add.collider(this.player.sprite, this.platforms);

        //joystick
        if (this.isMobile) {
            this.joystick = new Joystick(this, 100, this.cameras.main.height - 100);
        }

        //Enemies
        this.enemies1 = [];
        for (let i = 0; i < 3; i++) {
            let x = Phaser.Math.Between(300, 5900) * scale;
            this.enemies1.push(new Enemy(this, x, 500 * scale, 'enemie1', 1, 200, { min: x - 300, max: x + 300 }, scale));
        }

        this.enemies2 = [];
        for (let i = 0; i < 3; i++) {
            let y = Phaser.Math.Between(100, 500) * scale;
            let x = Phaser.Math.Between(300, 5900) * scale;
            this.enemies2.push(new Enemy(this, x, y, 'enemie2', 1, 100, { min: y - 150, max: y + 150 }, scale, true));
        }

        // level 3
      
        this.goal = new Goal(this, 6230 * scale, 600 * scale, 'Level1', 'goal3', scale);

        // Platforms
        this.platforms = new Platforms(this, 'levelData3');

        //Objects
        this.objects = [];
        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(300, 5900);
            let y = Phaser.Math.Between(100, 500);
            let objectType = Phaser.Math.Between(1, 3) === 1 ? 'popsicle' : (Phaser.Math.Between(1, 3) === 2 ? 'candy' : 'bar');
            let object = new GameObject(this, x, y, objectType);
            object.sprite.setScale(scale * 0.3); 

            this.objects.push(object);
        }

        //Score
       
        this.scoreText = this.add.text(16 * scale, 16 * scale, 'Points: 0', {
            fontSize: `${32 * scale}px`, 
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
            if (this.isMobile) {
                this.player.update(this.cursors, this.spacebar, this.joystick);
            } else {
                this.player.update(this.cursors, this.spacebar);
            }
    
            this.enemies1.forEach(enemy => enemy.update());
            this.enemies2.forEach(enemy => enemy.update());
        }
    }
}
