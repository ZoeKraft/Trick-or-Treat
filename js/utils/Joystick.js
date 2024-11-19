export default class Joystick {
    constructor(scene, x, y, radius = 50) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;

        // Base
        this.base = this.scene.add.circle(x, y, radius, 0x888888, 0.5).setScrollFactor(0);
        
        // Thumb
        this.thumb = this.scene.add.circle(x, y, radius / 2, 0xcccccc, 0.7).setScrollFactor(0);

        // Interaction
        this.base.setInteractive();

        // Direction
        this.value = { x: 0, y: 0 };

        // Power button
        this.powerButton = this.scene.add.circle(
            this.scene.cameras.main.width - 100, // Position at the bottom-right
            this.scene.cameras.main.height - 100,
            30, 
            0xFF6600, 
            0.8
        ).setScrollFactor(0).setInteractive();

        this.isPowerActive = false;

        // Power button event listeners
        this.powerButton.on('pointerdown', () => {
            console.log("Power button pressed");
            this.isPowerActive = true;
        });

        this.powerButton.on('pointerup', () => {
            this.isPowerActive = false;
        });

        // Dragging
        this.scene.input.on('pointerdown', (pointer) => {
            if (this.base.getBounds().contains(pointer.x, pointer.y)) {
                this.isDragging = true;
                this.updateThumbPosition(pointer);
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                this.updateThumbPosition(pointer);
            }
        });

        this.scene.input.on('pointerup', () => {
            this.isDragging = false;
            this.resetThumbPosition();
        });
    }

    updateThumbPosition(pointer) {
        const deltaX = pointer.x - this.x;
        const deltaY = pointer.y - this.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > this.radius) {
            const angle = Math.atan2(deltaY, deltaX);
            this.thumb.x = this.x + Math.cos(angle) * this.radius;
            this.thumb.y = this.y + Math.sin(angle) * this.radius;
        } else {
            this.thumb.x = pointer.x;
            this.thumb.y = pointer.y;
        }

        this.value.x = (this.thumb.x - this.x) / this.radius;
        this.value.y = (this.thumb.y - this.y) / this.radius;
    }

    resetThumbPosition() {
        this.thumb.x = this.x;
        this.thumb.y = this.y;
        this.value = { x: 0, y: 0 };
    }

    getDirection() {
        return this.value;
    }

    isPowerPressed() {
        return this.isPowerActive;
    }
}
