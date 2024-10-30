export default class Platforms {
    constructor(scene) {
        this.scene = scene;
        this.platforms = this.scene.physics.add.staticGroup();
        this.loadPlatforms();
    }

    loadPlatforms() {
        this.scene.load.json('levelData', 'levelData.json');
        this.scene.load.once('complete', () => {
            const levelData = this.scene.cache.json.get('levelData');
            this.createPlatforms(levelData.platforms);
        });
        this.scene.load.start();
    }

    createPlatforms(platformPositions) {
        platformPositions.forEach(pos => {
            const adjustedY = pos.y * (window.innerHeight / 700);
            const platform = this.platforms.create(pos.x, adjustedY, pos.key).setScale(0.5).refreshBody();
            platform.setSize(300, 1);
        });

        this.scene.physics.add.collider(this.scene.player.sprite, this.platforms);
    }
}
