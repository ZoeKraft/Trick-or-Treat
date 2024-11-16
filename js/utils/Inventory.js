export default class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.items = [];
        this.isVisible = false;
        this.inventoryButton = this.scene.add.image(50, 50, 'inventory')
            .setOrigin(0, 0)
            .setInteractive()
            .setScrollFactor(0);

        this.inventoryButton.on('pointerdown', () => {
            this.toggleInventory();
        });


        // container 
        this.inventoryContainer = this.scene.add.container(0, 0).setDepth(10).setScrollFactor(0);  // Evitamos que el inventario se mueva con la cámara
        this.inventoryBackground = this.scene.add.graphics();
        this.inventoryContainer.add(this.inventoryBackground);
        this.itemsContainer = this.scene.add.container(0, 0);
        this.inventoryContainer.add(this.itemsContainer);

        // title
        this.inventoryItemsText = this.scene.add.text(170, 100, 'Inventory', {
            fontSize: '20px',
            fill: '#fff',
        });
        this.inventoryContainer.add(this.inventoryItemsText);
        this.hideInventory();
    }

    // see/dont function
    toggleInventory() {
        if (this.isVisible) {
            this.hideInventory();
        } else {
            this.showInventory();
        }
    }


    //visible function
    showInventory() {
        this.isVisible = true;
        this.inventoryBackground.clear();
        this.inventoryBackground.fillStyle(0x000000, 0.8);
        this.inventoryBackground.fillRect(150, 70, 400, 600);
        this.updateInventory();
        this.inventoryContainer.setVisible(true);
    }

    //hide
    hideInventory() {
        this.isVisible = false;
        this.inventoryContainer.setVisible(false);
    }

    updateInventory() {
        this.itemsContainer.removeAll(true);

        let startX = 250;
        let startY = 180;

        //items
        this.items.forEach((item, index) => {


            const itemImage = this.scene.add.image(startX, startY, item.imageKey)
                .setOrigin(0.5)
                .setScale(0.3); 

            
            const itemName = this.scene.add.text(startX, startY + 50, item.name, {
                fontSize: '16px',
                fill: '#fff'
            }).setOrigin(0.5, 0);

           
            const itemQuantity = this.scene.add.text(startX, startY + 70, `Quantity: ${item.quantity}`, {
                fontSize: '14px',
                fill: '#fff'
            }).setOrigin(0.5, 0);


            this.itemsContainer.add(itemImage);
            this.itemsContainer.add(itemName);
            this.itemsContainer.add(itemQuantity);

            startY += 120;
        });
    }

    // add items funtion
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
