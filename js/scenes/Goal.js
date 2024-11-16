export default class Goal {
    constructor(scene, x, y, nextLevel = 'Level2', imageKey = 'goal') {
        this.scene = scene;
        this.nextLevel = nextLevel; 
        this.sprite = scene.physics.add.image(x, y, imageKey); 
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setImmovable(true);
        this.sprite.body.allowGravity = false;
        this.sprite.setDisplaySize(200, 200);
        this.sprite.setOffset(0, 0);
        this.sprite.setSize(200, 240);

        // Colisión
        scene.physics.add.collider(this.sprite, scene.platforms);
        scene.physics.add.overlap(scene.player.sprite, this.sprite, this.reachGoal, null, this);
    }

    reachGoal() {
        const winText = this.scene.add.text(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, "¡Nivel Completado!", {
            fontSize: '40px',
            fill: '#ff0'
        }).setOrigin(0.5);
        winText.setScrollFactor(0);

        this.scene.time.delayedCall(2000, () => {
            winText.destroy();
           
            this.scene.scene.start(this.nextLevel); 
        });
    }
}
