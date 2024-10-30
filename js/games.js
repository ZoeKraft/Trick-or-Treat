// Crear una escena
let gameScene = new Phaser.Scene('Game');


// Definimos los puntos para cada objeto
const puntosPorObjeto = {
    object1: 20, // objeto1 vale 20 puntos
    object2: 30, // objeto2 vale 30 puntos
    object3: 50  // objeto3 vale 50 puntos
};

let puntosTotales = 0;


// Cargar activos
gameScene.preload = function () {
    this.load.image('background', './img/background1.png');
    this.load.image('platform', './img/platform.png');
    this.load.image('object1', './img/sweet1.png');
    this.load.image('object2', './img/sweet2.png');
    this.load.image('object3', './img/sweet3.png');
    this.load.image('enemie1', './img/enemigo-naranja.png');
    this.load.image('enemie2', './img/enemigo-morado.png');

    //caminar animation
    this.load.spritesheet('player', './img/player3.png', {
        frameWidth: 175,
        frameHeight: 175,
        margin: -1,
        spacing: -1
    });

    //saltar animation
    this.load.spritesheet('jump', './img/salto.png', {
        frameWidth: 175,
        frameHeight: 175,
        margin: 0,
        spacing: 0
    });
};

// Crear la escena
gameScene.create = function () {
    // Añadir el fondo
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.background.setDisplaySize(6200, window.innerHeight);
    
    this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight - 30);

    // Crear el personaje
    this.player = this.physics.add.sprite(100, 200, 'player');
    this.player.setGravityY(500);
    this.player.setCollideWorldBounds(true);
    this.player.scale = 0.8;

    //walking animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
        frameRate: 10,
        yoyo: true,
        repeat: -1
    });
    this.player.anims.play('walk');

    // Saltar animation
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('jump', { start: 4, end: 7 }),
        frameRate: 5,
        hideOnComplete: true
    });

    // Crear grupos de enemigos
    this.enemies1 = this.physics.add.group();
    this.enemies2 = this.physics.add.group();

    // Crear enemigos1
    for (let i = 0; i < 2; i++) {
        let x = Phaser.Math.Between(300, 5900);
        let enemy = this.enemies1.create(x, 500, 'enemie1');
        enemy.setCollideWorldBounds(true);
        enemy.scale = 0.15;
        enemy.direction = 1; // 1 para derecha, -1 para izquierda
        enemy.speed = 200;
        enemy.range = { min: x - 300, max: x + 300 };
        enemy.body.setVelocityX(enemy.direction * enemy.speed);
        enemy.initialX = x; // Guardar posición inicial
    }

    // Crear enemigos2
    for (let i = 0; i < 2; i++) {
        let y = Phaser.Math.Between(100, 500);
        let x = Phaser.Math.Between(300, 5900);
        let enemy = this.enemies2.create(x, y, 'enemie2');
        enemy.setCollideWorldBounds(true);
        enemy.scale = 0.15;
        enemy.direction = 1; // 1 para abajo, -1 para arriba
        enemy.speed = 100;
        enemy.range = { min: y - 150, max: y + 150 };
        enemy.body.setVelocityY(enemy.direction * enemy.speed);
        enemy.initialY = y; // Guardar posición inicial
    }

 // Crear un grupo para los objetos (dulces)
 this.objects = this.physics.add.group();

 // Crear objetos aleatorios
 for (let i = 0; i < 10; i++) {
     let x = Phaser.Math.Between(300, 5900);
     let y = Phaser.Math.Between(100, 500);
     let objectType = Phaser.Math.Between(1, 3);

     let object;
     switch (objectType) {
         case 1:
             object = this.objects.create(x, y, 'object1');
             object.type = 'object1';
             break;
         case 2:
             object = this.objects.create(x, y, 'object2');
             object.type = 'object2';
             break;
         case 3:
             object = this.objects.create(x, y, 'object3');
             object.type = 'object3';
             break;
     }

     object.setCollideWorldBounds(true);
     object.scale = 0.5;
 }

 // Manejo de colisiones entre el jugador y los objetos
 this.physics.add.overlap(this.player, this.objects, this.collectObject, null, this);

 // Inicializar texto de puntuación
this.scoreText = this.add.text(16, 16, 'Puntaje: 0', {
    fontSize: '32px',
    fill: '#fff'
}).setScrollFactor(0); // Asegura que el texto no se mueva con la cámara

    // Crear plataformas
    this.platforms = this.physics.add.staticGroup();
    const platformPositions = [
        { x: 800, y: 520 },
        { x: 1100, y: 520 },
        { x: 1600, y: 370 },
        { x: 2100, y: 520 },
        { x: 3500, y: 520 },
        { x: 4500, y: 520 },
        { x: 4900, y: 380 },
        { x: 5200, y: 380 },
        { x: 5600, y: 200 }
    ];

    platformPositions.forEach(pos => {
        const adjustedY = pos.y * (window.innerHeight / 700);
        const platform = this.platforms.create(pos.x, adjustedY, 'platform').setScale(0.5).refreshBody();
        platform.setSize(300, 1);
    });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.objects, this.platforms);
    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();

    // Variable para controlar la colisión
    this.isColliding = false

    this.physics.add.overlap(this.player, this.enemies1, this.handleCollision, null, this);
    this.physics.add.overlap(this.player, this.enemies2, this.handleCollision, null, this);

    this.collisionText = this.add.text(0, 0, '', {
        fontSize: '20px',
        fill: '#fff'
    });
    this.collisionText.visible = false; // Inicialmente oculto
};
// Función para manejar la recolección de objetos
gameScene.collectObject = function (player, object) {
    const puntosGanados = puntosPorObjeto[object.type]; // Obtener puntos del objeto
    puntosTotales += puntosGanados; // Sumar puntos totales
    this.scoreText.setText('Puntaje: ' + puntosTotales); // Actualizar el texto de puntaje
    object.destroy(); // Destruir el objeto recolectado
    this.showCollisionMessage('¡Recogiste un dulce!'); // Mostrar mensaje
};

gameScene.showCollisionMessage = function (message) {
    this.collisionText.setText(message);
    this.collisionText.visible = true;
    this.time.delayedCall(1000, () => {
        this.collisionText.visible = false;
    });
};



gameScene.handleCollision = function (player, enemy) {
    if (!this.isColliding) {
        this.isColliding = true; 
        this.showCollisionMessage('¡Chocaste con un enemigo!');

        this.time.delayedCall(1000, () => {
            player.setPosition(100, 200); 
            this.isColliding = false; 
            
            // Reanudar el juego
            this.scene.resume();
        });
    }
};

/*
gameScene.resizeBackground = function () {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Ajustar el tamaño del fondo manteniendo la relación de aspecto
    if (windowWidth / windowHeight > 6200 / windowHeight) {
        // Si la relación de aspecto es más ancha que el fondo
        this.background.setDisplaySize(windowHeight * (6200 / windowHeight), windowHeight);
    } else {
        // Si la relación de aspecto es más estrecha que el fondo
        this.background.setDisplaySize(windowWidth, windowWidth * (windowHeight / 6200));
    }

    // Centrar el fondo
    this.background.setOrigin(0.5, 0.5);
    this.background.x = windowWidth / 2;
    this.background.y = windowHeight / 2;
};
*/



// Actualizar la escena
gameScene.update = function () {
    // Movimiento horizontal del jugador
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-300);
        if (this.player.body.onFloor()) {
            this.player.anims.play('walk', true);
        }
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(300);
        if (this.player.body.onFloor()) {
            this.player.anims.play('walk', true);
        }
    } else {
        this.player.setVelocityX(0);
        if (this.player.body.onFloor()) {
            this.player.anims.stop();
        }
    }

    // Actualiza la posición del texto de colisión
    if (this.collisionText.visible) {
        this.collisionText.x = this.player.x;
        this.collisionText.y = this.player.y - 100; // Ajusta la altura según sea necesario
    }

    // Saltar
    if (this.cursors.up.isDown && this.player.body.onFloor() && this.player.canJump) {
        this.player.setVelocityY(-590);
        this.player.canJump = false;
        this.player.anims.play('jump');
    }

    // Volver a permitir saltar cuando el jugador esté en el suelo
    if (this.player.body.onFloor()) {
        this.player.canJump = true;
        if (this.player.anims.currentAnim.key !== 'walk') {
            this.player.anims.stop();
        }
    }

    // Movimiento de los enemigos1
    this.enemies1.children.iterate((enemy) => {
        if (enemy) {
            if (enemy.x <= enemy.range.min || enemy.x >= enemy.range.max) {
                enemy.direction *= -1; // Cambiar dirección
                enemy.body.setVelocityX(enemy.direction * enemy.speed); // Actualizar velocidad
                // Cambiar a la posición inicial si se ha llegado al límite
                if (enemy.x <= enemy.range.min) {
                    enemy.body.setVelocityX(enemy.speed); // Volver a la dirección inicial
                }
                if (enemy.x >= enemy.range.max) {
                    enemy.body.setVelocityX(-enemy.speed); // Volver a la dirección inicial
                }
            } else {
                enemy.body.setVelocityX(enemy.direction * enemy.speed);
            }
        }
    });

    // Movimiento de los enemigos2
    this.enemies2.children.iterate((enemy) => {
        if (enemy) {
            if (enemy.y <= enemy.range.min || enemy.y >= enemy.range.max) {
                enemy.direction *= -1; // Cambiar dirección
                enemy.body.setVelocityY(enemy.direction * enemy.speed); // Actualizar velocidad
                // Cambiar a la posición inicial si se ha llegado al límite
                if (enemy.y <= enemy.range.min) {
                    enemy.body.setVelocityY(enemy.speed); // Volver a la dirección inicial
                }
                if (enemy.y >= enemy.range.max) {
                    enemy.body.setVelocityY(-enemy.speed); // Volver a la dirección inicial
                }
            } else {
                enemy.body.setVelocityY(enemy.direction * enemy.speed);
            }
        }
    });


    if(this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC))) {
        window.location.href = "menu.html";
    }
};

let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth, // Ajustar el ancho al tamaño de la ventana
    height: window.innerHeight, // Ajustar la altura al tamaño de la ventana
    scene: gameScene,
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};


// Inicializar el juego
let game = new Phaser.Game(config);


