export default class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.items = [];
        this.isVisible = false;

        // Crear el botón para abrir el inventario
        this.inventoryButton = this.scene.add.image(50, 50, 'inventory')
            .setOrigin(0, 0)
            .setInteractive()
            .setScrollFactor(0);

        this.inventoryButton.on('pointerdown', () => {
            this.toggleInventory();
        });


        // Contenedor del inventario
        this.inventoryContainer = this.scene.add.container(0, 0).setDepth(10).setScrollFactor(0);  // Evitamos que el inventario se mueva con la cámara
        this.inventoryBackground = this.scene.add.graphics();
        this.inventoryContainer.add(this.inventoryBackground);

        // Creamos un contenedor para las imágenes y textos de los objetos
        this.itemsContainer = this.scene.add.container(0, 0);
        this.inventoryContainer.add(this.itemsContainer);

        // Título del inventario
        this.inventoryItemsText = this.scene.add.text(170, 100, 'Inventory', {
            fontSize: '20px',
            fill: '#fff',
        });
        this.inventoryContainer.add(this.inventoryItemsText);
        this.hideInventory();
    }

    // Función para mostrar/ocultar el inventario
    toggleInventory() {
        if (this.isVisible) {
            this.hideInventory();
        } else {
            this.showInventory();
        }
    }


    // Función para mostrar el inventario
    showInventory() {
        this.isVisible = true;
        this.inventoryBackground.clear();
        this.inventoryBackground.fillStyle(0x000000, 0.8);
        this.inventoryBackground.fillRect(150, 70, 400, 600);
        this.updateInventory();
        this.inventoryContainer.setVisible(true);
    }

    // Función para ocultar el inventario
    hideInventory() {
        this.isVisible = false;
        this.inventoryContainer.setVisible(false);
    }

    updateInventory() {
        this.itemsContainer.removeAll(true);

        let startX = 250;
        let startY = 180;

        // Mostrar los objetos con su imagen, nombre y cantidad
        this.items.forEach((item, index) => {

            // Imagen del objeto
            const itemImage = this.scene.add.image(startX, startY, item.imageKey)
                .setOrigin(0.5)
                .setScale(0.3); // Ajustamos el tamaño de la imagen

            // Nombre del objeto
            const itemName = this.scene.add.text(startX, startY + 50, item.name, {
                fontSize: '16px',
                fill: '#fff'
            }).setOrigin(0.5, 0);

            // Cantidad del objeto
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

    // Función para agregar un objeto al inventario
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
