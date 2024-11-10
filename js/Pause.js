// Pause.js
export default class Pause {
    constructor(scene) {
        this.scene = scene;
        this.panel = null;
        this.isPaused = false;

        // Contenedor para los botones
        this.buttonContainer = this.scene.add.container(this.scene.cameras.main.width - 66, 16);
        this.createButtons();

        // No olvidar establecer el scroll factor a 0
        this.buttonContainer.setScrollFactor(0);

        // Actualiza la posición del contenedor en cada frame
        this.scene.events.on('update', this.updateButtonsPosition, this);
    }

    createButtons() {
        const buttonSize = 50; // Tamaño del botón

        // Botón de play
        this.playButton = this.scene.add.sprite(0, 0, 'playButton')
            .setInteractive()
            .setOrigin(0, 0)
            .setDisplaySize(buttonSize, buttonSize)
            .on('pointerdown', () => this.togglePause());

        // Botón de pausa
        this.pauseButton = this.scene.add.sprite(0, 0, 'pauseButton')
            .setInteractive()
            .setOrigin(0, 0)
            .setDisplaySize(buttonSize, buttonSize)
            .on('pointerdown', () => this.togglePause())
            .setVisible(false); 

      
        this.buttonContainer.add(this.playButton);
        this.buttonContainer.add(this.pauseButton);
    }

    updateButtonsPosition() {
       
        this.buttonContainer.x = this.scene.cameras.main.width - 66;
        this.buttonContainer.y = 16;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        console.log("Estado de pausa:", this.isPaused);
    
        if (this.isPaused) {
            this.scene.physics.world.pause();
            this.playButton.setVisible(true);
            this.pauseButton.setVisible(false);
            this.showPausePanel();
        } else {
            this.scene.physics.world.resume();
            this.playButton.setVisible(false);
            this.pauseButton.setVisible(true);
            if (this.panel) {
                this.panel.destroy();
                this.panel = null;
            }
        }
    }
    showPausePanel() {
        
        this.panel = this.scene.add.container(this.scene.cameras.main.width - 200, this.scene.cameras.main.centerY); 
    
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.8); 
        background.fillRect(-150, -100, 300, 300); 
        this.panel.add(background);
    
        const titleStyle = { fontSize: '48px', fill: '#F28705', fontFamily: '"Bree Serif", serif', stroke: '#000', strokeThickness: 5 }; 
        const text = this.scene.add.text(0, -40, 'PAUSE', titleStyle).setOrigin(0.5);
        this.panel.add(text);
    
        const buttonStyle = { fontSize: '32px', fill: '#fff', fontFamily: '"Bree Serif", serif', align: 'center' };
    
        const continueButton = this.scene.add.text(-80, 0, 'Continue', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.togglePause())
            .on('pointerover', () => continueButton.setStyle({ fill: '#F28705' })) 
            .on('pointerout', () => continueButton.setStyle({ fill: '#fff' })); 
        this.panel.add(continueButton);
    
        const restartButton = this.scene.add.text(-80, 40, 'Restart', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.scene.restartGame())
            .on('pointerover', () => restartButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => restartButton.setStyle({ fill: '#fff' }));
        this.panel.add(restartButton);
    
        const exitButton = this.scene.add.text(-80, 80, 'Exit', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.exitGame())
            .on('pointerover', () => exitButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => exitButton.setStyle({ fill: '#fff' }));
        this.panel.add(exitButton);
    }

    exitGame() {
        // Redirigir al menú del juego
        window.location.href = 'menu.html'; // Asegúrate de que la ruta sea correcta
    }
}
