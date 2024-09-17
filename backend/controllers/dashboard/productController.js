const multer = require('multer');
const path = require('path');
const productModel = require('../../models/productModel');
const { responseReturn } = require('../../utiles/response');

// Configuración de almacenamiento de `multer`
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño de archivo (5MB)
});

class ProductController {
    add_product = async (req, res) => {
        upload.array('images', 10)(req, res, async (err) => { // Permite hasta 10 imágenes
            if (err) {
                return responseReturn(res, 400, { error: err.message });
            }

            const { name, category, description, stock, price, discount, shopName, brand } = req.body;
            const images = req.files.map(file => file.path); // Rutas de las imágenes

            const slug = name.trim().split(' ').join('-');

            try {
                await productModel.create({
                    sellerId: req.id,
                    name: name.trim(),
                    slug,
                    shopName: shopName.trim(),
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images, // Guardar las rutas de las imágenes
                    brand: brand.trim()
                });

                responseReturn(res, 201, { message: "Producto agregado exitosamente" });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    }

    products_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        const { id } = req;

        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const totalProduct = await productModel.countDocuments({
                    $text: { $search: searchValue },
                    sellerId: id
                });
                responseReturn(res, 200, { totalProduct, products });
            } else {
                const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const totalProduct = await productModel.countDocuments({ sellerId: id });
                responseReturn(res, 200, { totalProduct, products });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    product_update = async (req, res) => {
        let { name, description, discount, price, brand, productId, stock } = req.body;
        name = name.trim();
        const slug = name.split(' ').join('-');
        try {
            await productModel.findByIdAndUpdate(productId, {
                name, description, discount, price, brand, stock, slug
            });
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product, message: 'Producto actualizado exitosamente' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    product_image_update = async (req, res) => {
        upload.single('newImage')(req, res, async (err) => {
            if (err) {
                return responseReturn(res, 400, { error: err.message });
            }

            const { productId, oldImage } = req.body;
            const newImage = req.file.path; // Nueva ruta de la imagen

            try {
                let { images } = await productModel.findById(productId);
                const index = images.findIndex(img => img === oldImage);
                if (index !== -1) {
                    images[index] = newImage;

                    await productModel.findByIdAndUpdate(productId, { images });

                    responseReturn(res, 200, { message: 'Imagen del producto actualizada exitosamente' });
                } else {
                    responseReturn(res, 404, { error: 'Imagen no encontrada' });
                }
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    }

    delete_product = async (req, res) => {
        const { productId } = req.params; // Obtener el ID del producto de los parámetros de la ruta
        try {
            // Eliminar el producto de la base de datos
            await productModel.findByIdAndDelete(productId);
            responseReturn(res, 200, { message: 'Producto eliminado exitosamente' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new ProductController();
