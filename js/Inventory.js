export default class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.items = []; // Almacenamos objetos con nombre, imagen y cantidad
        this.isVisible = false; // Estado de visibilidad del inventario

        // Crear el botón para abrir el inventario
        this.inventoryButton = this.scene.add.image(50, 50, 'inventory')  
            .setOrigin(0, 0)  
            .setInteractive() 
            .setScrollFactor(0);  // Evitamos que el botón se mueva con la cámara

        // Al hacer clic en el botón, cambiamos la visibilidad del inventario
        this.inventoryButton.on('pointerdown', () => {
            this.toggleInventory();
        });

        // Contenedor del inventario, inicialmente oculto
        this.inventoryContainer = this.scene.add.container(0, 0).setDepth(10).setScrollFactor(0);  // Evitamos que el inventario se mueva con la cámara
        this.inventoryBackground = this.scene.add.graphics();
        this.inventoryContainer.add(this.inventoryBackground);

        // Creamos un contenedor para las imágenes y textos de los objetos
        this.itemsContainer = this.scene.add.container(0, 0);
        this.inventoryContainer.add(this.itemsContainer);

        // Título del inventario
        this.inventoryItemsText = this.scene.add.text(170, 100, 'Inventario', {
            fontSize: '20px',
            fill: '#fff',
        });
        this.inventoryContainer.add(this.inventoryItemsText);

        this.hideInventory();  // Inicialmente ocultamos el inventario
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
        this.inventoryBackground.fillRect(150, 70, 400, 600);  // Fondo del inventario
        this.updateInventory();  // Actualizamos la visualización
        this.inventoryContainer.setVisible(true);  
    }

    // Función para ocultar el inventario
    hideInventory() {
        this.isVisible = false;
        this.inventoryContainer.setVisible(false);  
    }

    // Actualiza el inventario: se reorganizan las imágenes y los textos
    updateInventory() {
        this.itemsContainer.removeAll(true);

        // Posición inicial para colocar los objetos de forma ordenada
        let startX = 250;  // X de inicio
        let startY = 180;  // Y de inicio

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
            const itemQuantity = this.scene.add.text(startX, startY + 70, `Cantidad: ${item.quantity}`, {
                fontSize: '14px',
                fill: '#fff'
            }).setOrigin(0.5, 0);

            // Agregar todos los elementos al contenedor
            this.itemsContainer.add(itemImage);
            this.itemsContainer.add(itemName);
            this.itemsContainer.add(itemQuantity);

            // Ajustamos la posición para el siguiente objeto
            startY += 120;  // Incrementamos la posición Y para la siguiente fila
        });
    }

    // Función para agregar un objeto al inventario
    addItem(item) {
        // Comprobar si el objeto ya está en el inventario
        const existingItem = this.items.find(existing => existing.name === item.name);

        if (existingItem) {
            // Si ya existe, aumentamos la cantidad
            existingItem.quantity += 1;
        } else {
            // Si no existe, lo agregamos con cantidad 1
            this.items.push({ ...item, quantity: 1 });
        }

        // Actualizamos la visualización
        this.updateInventory(); 
    }
}
