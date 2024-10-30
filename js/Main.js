import Player from './Player.js';
import Platforms from './Platforms.js';
import Camera from './Camera.js';
import Enemy from './Enemy.js';
import GameObject from './Object.js'; 

let gameScene = new Phaser.Scene('Game');

gameScene.puntosTotales = 0; // Agregar la propiedad para puntos totales

// Cargar activos
gameScene.preload = function () {
    console.log("Cargando recursos...");
    this.load.image('background', './img/background1.png');
    this.load.image('platform', './img/platform.png');
    this.load.image('object1', './img/sweet1.png');
    this.load.image('object2', './img/sweet2.png');
    this.load.image('object3', './img/sweet3.png');
    this.load.image('enemie1', './img/enemigo-naranja.png');
    this.load.image('enemie2', './img/enemigo-morado.png');

    // Animaciones
    this.load.spritesheet('player', './img/player3.png', {
        frameWidth: 175,
        frameHeight: 175,
        margin: -1,
        spacing: -1
    });

    this.load.spritesheet('jump', './img/salto.png', {
        frameWidth: 175,
        frameHeight: 175,
        margin: 0,
        spacing: 0
    });

    // Load json file
    this.load.json('levelData', './data/levelData.json');
};

// Crear la escena
gameScene.create = function () {
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

    // Crear plataformas
    this.platforms = new Platforms(this);

    // Crear objetos aleatorios
    this.objects = [];
    for (let i = 0; i < 10; i++) {
        let x = Phaser.Math.Between(300, 5900);
        let y = Phaser.Math.Between(100, 500);
        let objectType = `object${Phaser.Math.Between(1, 3)}`;
        this.objects.push(new GameObject(this, x, y, objectType));
    }

    // Inicializar texto de puntuación
    this.scoreText = this.add.text(16, 16, 'points: 0', {
        fontSize: '32px',
        fill: '#fff'
    }).setScrollFactor(0);


    // Inicializar las teclas de movimiento
    this.cursors = this.input.keyboard.createCursorKeys();


    // Crear la cámara
    this.camera = new Camera(this, this.player.sprite);


    // Detección de colisión con enemigos
    this.enemies1.forEach(enemy => {
        this.physics.add.overlap(this.player.sprite, enemy.sprite, this.restartGame, null, this);
    });
    this.enemies2.forEach(enemy => {
        this.physics.add.overlap(this.player.sprite, enemy.sprite, this.restartGame, null, this);
    });
};



// Función para reiniciar el juego
gameScene.restartGame = function () {
  
    const collisionText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "!GAME OVER¡", {
        fontSize: '40px',
        fill: '#fff'
    }).setOrigin(0.5); 

    collisionText.setScrollFactor(0); 

    
    this.time.delayedCall(1000, () => {
        collisionText.destroy(); 
        this.scene.restart(); 
    });
};



// Mostrar mensaje de colisión
gameScene.showCollisionMessage = function (message) {
    const collisionText = this.add.text(this.player.sprite.x, this.player.sprite.y - 100, message, { fontSize: '20px', fill: '#fff' });
    this.time.delayedCall(1000, () => {
        collisionText.destroy();
    });
};



// Función de actualización
gameScene.update = function () {
    // Actualizar el jugador
    this.player.update(this.cursors);

    // Actualizar enemigos
    this.enemies1.forEach(enemy => enemy.update());
    this.enemies2.forEach(enemy => enemy.update());
};



// Configuración del juego
let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true
        }
    }
};


// Inicializar el juego
let game = new Phaser.Game(config);
console.log("Juego inicializado.");
