export default class Platforms {
    constructor(scene, levelDataFile) {
        this.scene = scene;
        this.platforms = this.scene.physics.add.staticGroup();
        this.levelDataFile = levelDataFile; 
        this.loadPlatforms();
    }

    loadPlatforms() {
        this.scene.load.json(this.levelDataFile, `./data/${this.levelDataFile}.json`); // Usar el archivo correcto según el nivel
        this.scene.load.once('complete', () => {
            const levelData = this.scene.cache.json.get(this.levelDataFile); // Obtener los datos usando la clave específica
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
