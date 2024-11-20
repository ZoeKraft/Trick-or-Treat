export default class Pause {
    constructor(scene) {
        this.scene = scene;
        this.panel = null;
        this.isPaused = false; 
        this.scaleFactor = Math.min(this.scene.scale.width / 800, this.scene.scale.height / 600); 

        // Button container
        this.buttonContainer = this.scene.add.container(this.scene.cameras.main.width - 66 * this.scaleFactor, 16 * this.scaleFactor);
        this.createButtons();
        this.buttonContainer.setScrollFactor(0); 
        this.scene.events.on('update', this.updateButtonsPosition, this);
    }

    createButtons() {
        const buttonSize = 50 * this.scaleFactor;  

        // play button
        this.playButton = this.scene.add.sprite(0, 0, 'playButton')
            .setInteractive()
            .setOrigin(0, 0)
            .setDisplaySize(buttonSize, buttonSize)
            .on('pointerdown', () => this.togglePause());

        // pause button
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
        this.buttonContainer.x = this.scene.cameras.main.width - 66 * this.scaleFactor;
        this.buttonContainer.y = 16 * this.scaleFactor;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
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
        this.panel = this.scene.add.container(this.scene.cameras.main.centerX + 400 * this.scaleFactor, this.scene.cameras.main.centerY);
        this.panel.setScrollFactor(0); 

        const background = this.scene.add.image(0, 0, 'pauseBackground');  
        background.setOrigin(0.5, 0.5);  
        background.setDisplaySize(320 * this.scaleFactor, 450 * this.scaleFactor);  
        this.panel.add(background);

        const titleStyle = { 
            fontSize: `${48 * this.scaleFactor}px`,  
            fill: '#F28705', 
            fontFamily: '"Bree Serif", serif', 
            stroke: '#000', 
            strokeThickness: 5 
        };
        const text = this.scene.add.text(0, -130 * this.scaleFactor, 'PAUSE', titleStyle).setOrigin(0.5);
        this.panel.add(text);

        const buttonStyle = { 
            fontSize: `${32 * this.scaleFactor}px`,  
            fill: '#fff', 
            fontFamily: '"Bree Serif", serif', 
            align: 'center' 
        };

        const continueButton = this.scene.add.text(0, -70 * this.scaleFactor, 'Continue', buttonStyle)
            .setOrigin(0.5) 
            .setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => this.togglePause())
            .on('pointerover', () => continueButton.setStyle({ fill: '#F28705' })) 
            .on('pointerout', () => continueButton.setStyle({ fill: '#fff' })); 
        this.panel.add(continueButton);

        const restartButton = this.scene.add.text(0, -30 * this.scaleFactor, 'Restart', buttonStyle)
            .setOrigin(0.5) 
            .setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => this.scene.restartGame())
            .on('pointerover', () => restartButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => restartButton.setStyle({ fill: '#fff' }));
        this.panel.add(restartButton);

        const exitButton = this.scene.add.text(0, 10 * this.scaleFactor, 'Exit', buttonStyle)
            .setOrigin(0.5) 
            .setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => this.exitGame())
            .on('pointerover', () => exitButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => exitButton.setStyle({ fill: '#fff' }));
        this.panel.add(exitButton);

        const nextLevelButton = this.scene.add.text(0, 50 * this.scaleFactor, 'Next Level', buttonStyle)
            .setOrigin(0.5) 
            .setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => this.goToNextLevel())
            .on('pointerover', () => nextLevelButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => nextLevelButton.setStyle({ fill: '#fff' }));
        this.panel.add(nextLevelButton);

        const previousLevelButton = this.scene.add.text(0, 90 * this.scaleFactor, 'Previous Level', buttonStyle)
            .setOrigin(0.5) 
            .setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => this.goToPreviousLevel())
            .on('pointerover', () => previousLevelButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => previousLevelButton.setStyle({ fill: '#fff' }));
        this.panel.add(previousLevelButton);
    }

    exitGame() {
        //  menú
        window.location.href = 'menu.html'; 
    }

    goToNextLevel() {
        if (this.scene.scene.key === 'Level1') {
            this.scene.scene.start('Level2');
        } else if (this.scene.scene.key === 'Level2') {
            this.scene.scene.start('Level3');
        } else if (this.scene.scene.key === 'Level3') {
            this.scene.scene.start('Level1');
        }
        this.togglePause(); 
    }

    goToPreviousLevel() {
        if (this.scene.scene.key === 'Level3') {
            this.scene.scene.start('Level2');
        } else if (this.scene.scene.key === 'Level2') {
            this.scene.scene.start('Level1');
        } else if (this.scene.scene.key === 'Level1') {
            this.scene.scene.start('Level3');
        }
        this.togglePause(); 
    }
}
