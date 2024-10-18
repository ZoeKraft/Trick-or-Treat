import GameScene from './classes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 6200,
    height: window.innerHeight,
    scene: GameScene,
    scale: {
        mode: Phaser.Scale.RESIZE
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
