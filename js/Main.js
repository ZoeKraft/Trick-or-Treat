import Player from './Player.js';
import Platforms from './Platforms.js';
import Camera from './Camera.js';
import Enemy from './Enemy.js';
import GameObject from './Object.js';
import Pause from './Pause.js';
import Goal from './Goal.js';
import Inventory from './Inventory.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Propiedades de la escena
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

    // Preload de activos
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
        this.load.image('goal', './img/goal.png');
        this.load.image('inventory', './img/inventory.png');

        // Animaciones
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



        // Load json file
        this.load.json('levelData', './data/levelData.json');
    }

    // Crear la escena
    create() {
        // Añadir el fondo
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.setDisplaySize(6200, window.innerHeight);
        this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight - 30);

        // Crear el jugador usando la clase Player
        this.player = new Player(this, 100, 200);
        this.physics.add.collider(this.player.sprite, this.platforms);

        // Crear enemigos
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

        // Crear el objetivo al final del juego
        this.goal = new Goal(this, 6050, 600); // Ajusta la posición según sea necesario

        // Crear plataformas
        this.platforms = new Platforms(this);


        // Crear objetos (candy)
        this.objects = [];
        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(300, 5900);
            let y = Phaser.Math.Between(100, 500);
            let objectType = Phaser.Math.Between(1, 3) === 1 ? 'popsicle' : (Phaser.Math.Between(1, 3) === 2 ? 'candy' : 'bar');
            this.objects.push(new GameObject(this, x, y, objectType)); // Creamos el objeto de tipo GameObject
        }

        // Crear el texto de puntuación
        this.scoreText = this.add.text(16, 16, 'Points: 0', {
            fontSize: '32px',
            fill: '#fff'
        }).setScrollFactor(0);



        // Crear la instancia de la clase Pause
        this.pause = new Pause(this);

        // Inicializar las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Crear la cámara
        this.camera = new Camera(this, this.player.sprite);

        // Detección de colisión con enemigos
        this.enemies1.forEach(enemy => {
            this.physics.add.overlap(this.player.sprite, enemy.sprite, this.restartGame, null, this);
        });
        this.enemies2.forEach(enemy => {
            this.physics.add.overlap(this.player.sprite, enemy.sprite, this.restartGame, null, this);
        });


        // Crear la instancia de Inventario 
        this.inventory = new Inventory(this);



    }



    // Función de reinicio del juego
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

    // Mostrar un mensaje al recoger un objeto
    showCollisionMessage(message) {
        const collisionText = this.add.text(this.player.sprite.x, this.player.sprite.y - 100, message, { fontSize: '20px', fill: '#fff' });
        this.time.delayedCall(1000, () => {
            collisionText.destroy(); // Eliminar el mensaje después de 1 segundo
        });
    }
    // Función de actualización
    update() {
        if (!this.pause.isPaused) { // Solo actualizar si no está en pausa
            // Actualizar el jugador
            this.player.update(this.cursors, this.spacebar);

            // Actualizar enemigos
            this.enemies1.forEach(enemy => enemy.update());
            this.enemies2.forEach(enemy => enemy.update());

        }
    }
}


// Configuración del juego
let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: GameScene,  // Aquí se debe usar GameScene con mayúsculas
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false // Desactivar debug
        }
    }
};

// Inicializar el juego
const game = new Phaser.Game(config);
console.log("Juego inicializado.");
