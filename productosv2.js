const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productIdCounter = 1;

        if (fs.existsSync(this.path)) {
            try {
                const data = fs.readFileSync(this.path, 'utf-8');
                this.products = JSON.parse(data);
            } catch (error) {
                console.error('Error al cargar los productos desde el archivo:', error);
            }
        }
    }

    async saveProducts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
            console.log('Productos guardados con éxito');
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    addProduct(product) {
        product.id = this.productIdCounter;
        this.productIdCounter++;
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        return product;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
            this.saveProducts();
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
        }
    }
}

// Prueba
const productManager = new ProductManager('./productos.json');

console.log('Agregando manzana');
productManager.addProduct({
    title: 'manzana',
    description: 'Manzana roja',
    price: 100,
    thumbnail: 'manzanaroja.jpg',
    code: 'P1',
    stock: 10,
});

console.log('Agregando naranja');
productManager.addProduct({
    title: 'naranja',
    description: 'Naranja jugosa',
    price: 120,
    thumbnail: 'naranja.jpg',
    code: 'P2',
    stock: 5,
});

console.log('Obteniendo lista de productos');
console.log(productManager.getProducts());

console.log('Obteniendo producto por ID');
console.log(productManager.getProductById(2));

console.log('Actualizando producto por ID');
productManager.updateProduct(2, {
    id: 2,
    title: 'naranja modificada',
    description: 'Naranja jugosa y modificada',
    price: 150,
    thumbnail: 'naranja_modificada.jpg',
    code: 'P2',
    stock: 7,
});

console.log('Obteniendo lista de productos después de la actualización');
console.log(productManager.getProducts());

console.log('Eliminando producto por ID');
productManager.deleteProduct(2);

console.log('Obteniendo lista de productos después de la eliminación');
console.log(productManager.getProducts());
