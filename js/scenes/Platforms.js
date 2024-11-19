export default class Platforms {
    constructor(scene, levelDataFile) {
        this.scene = scene;
        this.platforms = this.scene.physics.add.staticGroup();
        this.levelDataFile = levelDataFile;
        this.loadPlatforms();
    }

    loadPlatforms() {
        this.scene.load.json(this.levelDataFile, `./data/${this.levelDataFile}.json`);
        this.scene.load.once('complete', () => {
            const levelData = this.scene.cache.json.get(this.levelDataFile);
            this.createPlatforms(levelData.platforms);
        });
        this.scene.load.start();
    }

    createPlatforms(platformPositions) {
        const screenHeight = this.scene.scale.height;
        const screenWidth = this.scene.scale.width;
        const screenHeightReference = 780;
        const screenWidthReference = 1610;

        platformPositions.forEach(pos => {
            // positions
            const adjustedX = pos.x * (screenWidth / screenWidthReference);
            const adjustedY = pos.y * (screenHeight / screenHeightReference);
            let platform = this.platforms.create(adjustedX, adjustedY, pos.key);

            //platform scale
            if (screenHeight <= 1024) {
                platform.setScale(0.6, 0.6);  // big platform
            }
            if (screenHeight <= 800) {
                platform.setScale(0.5, 0.5);  // little platform
            } if (screenHeight <= 600) {
                platform.setScale(0.2, 0.25);
            }
            
            platform.setSize(platform.displayWidth, platform.displayHeight);
            platform.refreshBody();
        });

        this.scene.physics.add.collider(this.scene.player.sprite, this.platforms);
    }
}
