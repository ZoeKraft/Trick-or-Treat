export default class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.items = [];
        this.isVisible = false;

        //screen size
        this.scaleFactor = this.scene.scale.width / 800; 
        this.inventoryButton = this.scene.add.image(30 * this.scaleFactor, 40 * this.scaleFactor, 'inventory')
            .setOrigin(0, 0)
            .setInteractive()
            .setScrollFactor(0)
            .setScale(0.4 * this.scaleFactor);

        this.inventoryButton.on('pointerdown', () => {
            this.toggleInventory();
        });

        // Container
        this.inventoryContainer = this.scene.add.container(0, 0).setDepth(10).setScrollFactor(0);
        this.inventoryBackground = this.scene.add.graphics();
        this.inventoryContainer.add(this.inventoryBackground);
        this.itemsContainer = this.scene.add.container(0, 0);
        this.inventoryContainer.add(this.itemsContainer);

        // Title
        this.inventoryItemsText = this.scene.add.text(120 * this.scaleFactor, 60 * this.scaleFactor, 'Inventory', {
            fontSize: `${10 * this.scaleFactor}px`,
            fill: '#fff',
        });
        this.inventoryContainer.add(this.inventoryItemsText);

        this.hideInventory();
    }

    // Toggle function
    toggleInventory() {
        if (this.isVisible) {
            this.hideInventory();
        } else {
            this.showInventory();
        }
    }

    // Show inventory
    showInventory() {
        this.isVisible = true;
        this.inventoryBackground.clear();
        this.inventoryBackground.fillStyle(0x000000, 0.8);
        this.inventoryBackground.fillRect(110 * this.scaleFactor, 50 * this.scaleFactor, 160 * this.scaleFactor, 260 * this.scaleFactor);
        this.updateInventory();
        this.inventoryContainer.setVisible(true);
    }

    // Hide inventory
    hideInventory() {
        this.isVisible = false;
        this.inventoryContainer.setVisible(false);
    }

    updateInventory() {
        this.itemsContainer.removeAll(true);

        let startX = 130 * this.scaleFactor;
        let startY = 90 * this.scaleFactor;

        // Items
        this.items.forEach((item, index) => {
            const itemImage = this.scene.add.image(startX, startY, item.imageKey)
                .setOrigin(0.2)
                .setScale(0.12 * this.scaleFactor);

            const itemName = this.scene.add.text(startX, startY + (25 * this.scaleFactor), item.name, {
                fontSize: `${12 * this.scaleFactor}px`,
                fill: '#fff'
            }).setOrigin(0.1, 0);

            const itemQuantity = this.scene.add.text(startX, startY + (40 * this.scaleFactor), `Quantity: ${item.quantity}`, {
                fontSize: `${10 * this.scaleFactor}px`,
                fill: '#fff'
            }).setOrigin(0.1, 0);

            this.itemsContainer.add(itemImage);
            this.itemsContainer.add(itemName);
            this.itemsContainer.add(itemQuantity);

            startY += 75 * this.scaleFactor;
        });
    }

    // Add item function
    addItem(item) {
        const existingItem = this.items.find(existing => existing.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.updateInventory();
    }
}
