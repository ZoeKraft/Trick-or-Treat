export default class Pause {
    constructor(scene) {
        this.scene = scene;
        this.panel = null;
        this.isPaused = false;

        //button container
        this.buttonContainer = this.scene.add.container(this.scene.cameras.main.width - 66, 16);
        this.createButtons();
        this.buttonContainer.setScrollFactor(0);
        this.scene.events.on('update', this.updateButtonsPosition, this);
    }

    createButtons() {
        const buttonSize = 50; 

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
    
        
        const background = this.scene.add.image(0, 0, 'pauseBackground');  
        background.setOrigin(0.5, 0.5);  
        background.setDisplaySize(320, 450);  
    
        this.panel.add(background);
    
       
        const titleStyle = { fontSize: '48px', fill: '#F28705', fontFamily: '"Bree Serif", serif', stroke: '#000', strokeThickness: 5 }; 
        const text = this.scene.add.text(-10, -130, 'PAUSE', titleStyle).setOrigin(0.5);
        this.panel.add(text);
    
        const buttonStyle = { fontSize: '32px', fill: '#fff', fontFamily: '"Bree Serif", serif', align: 'center' };
    
        const continueButton = this.scene.add.text(-100, -70, 'Continue', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.togglePause())
            .on('pointerover', () => continueButton.setStyle({ fill: '#F28705' })) 
            .on('pointerout', () => continueButton.setStyle({ fill: '#fff' })); 
        this.panel.add(continueButton);
    
        const restartButton = this.scene.add.text(-100, -30, 'Restart', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.scene.restartGame())
            .on('pointerover', () => restartButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => restartButton.setStyle({ fill: '#fff' }));
        this.panel.add(restartButton);
    
        const exitButton = this.scene.add.text(-100, 10, 'Exit', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.exitGame())
            .on('pointerover', () => exitButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => exitButton.setStyle({ fill: '#fff' }));
        this.panel.add(exitButton);
    
        // next level button
        const nextLevelButton = this.scene.add.text(-100, 50, 'Next Level', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.goToNextLevel())
            .on('pointerover', () => nextLevelButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => nextLevelButton.setStyle({ fill: '#fff' }));
        this.panel.add(nextLevelButton);
    
        // previous level button
        const previousLevelButton = this.scene.add.text(-100,90, 'Previous Level', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => this.goToPreviousLevel())
            .on('pointerover', () => previousLevelButton.setStyle({ fill: '#F28705' }))
            .on('pointerout', () => previousLevelButton.setStyle({ fill: '#fff' }));
        this.panel.add(previousLevelButton);
    }
    exitGame() {
        // menu
        window.location.href = 'menu.html'; 
    }

    //next level
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

    // previous level
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
