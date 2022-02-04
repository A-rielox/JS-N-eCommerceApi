const path = require('path');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const {
   BadRequestError,
   UnauthenticatedError,
   NotFoundError,
} = require('../errors');

const createProduct = async (req, res) => {
   req.body.user = req.user.userId;
   const product = await Product.create(req.body);

   res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
   const products = await Product.find({});

   res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSingleProduct = async (req, res) => {
   const { id: productId } = req.params;

   const product = await Product.findOne({ _id: productId }).populate(
      'reviews'
   ); // 🍑

   if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
   }

   res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
   const { id: productId } = req.params;

   const product = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true, runValidators: true }
   );

   if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
   }

   res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
   const { id: productId } = req.params;

   const product = await Product.findOne({ _id: productId });

   if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
   }

   // se hace con .remove() para poder poner un .pre en el modelo y q el trigger sea 'remove', y poder remover todas las reviews del producto borrado
   await product.remove();

   res.status(StatusCodes.OK).json({ msg: 'Successfully deleted product' });
};

// este show es para subir la imagen a mi server a la carpeta upload, pa mandarla a cloudinary o donde sea de esos lugares tiene q hacerse a través de un req del front al servicio de almacenamiento
const uploadImage = async (req, res) => {
   if (!req.files) {
      throw new CustomError.BadRequestError('No file uploaded');
   }

   const productImage = req.files.image;

   if (!productImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please upload an image');
   }

   const maxSize = 4000000;
   if (productImage.size > maxSize) {
      throw new CustomError.BadRequestError(
         `Please upload an image smaller than ${maxSize} bytes`
      );
   }

   const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
   );

   await productImage.mv(imagePath);

   return res
      .status(StatusCodes.OK)
      .json({ image: `/uploads/${productImage.name}` });
   //la respuesta es el path a la imagen en el servidor ( el atributo src ), q es el q se va a ocupar en el submit para pasar la imagen del server a la DB.
};

module.exports = {
   createProduct,
   getAllProducts,
   getSingleProduct,
   updateProduct,
   deleteProduct,
   uploadImage,
};

// 🍑
// en getSingleProduct no se puede hacer directamente  ".populate('reviews')" xq el  product no está conectado a las reviews ( en el ProductSchema no tengo una prop con type: mongoose.Type.ObjectId y ref: 'Review' ), para esto se utilizan los "virtuals", estas props se crean "on-the-fly" ( no estan almacenadas en algun lugar )
//
//para esto en el ProductSchema agrego :
// con el "toJSON y toObject" es q le permito a este modelo aceptar virtuals

// para crear la propiedad virtual,
// el parametro 'reviews" es xq acá llamo ".populate('reviews')"
// ref: 'Review' -> para ocupar los documentos de reviews ( los ducumentos q ocupan el modelo 'Review' , q son los de la coleccion "reviews" )
// "localField: '_id'" -> el parametro local q ocupo para buscar en esa coleccion
// foreignField: 'product' -> el parametro en esa colleccion contra el cual hacer el match ( en ReviewSchema tengo:... product: {
//               type: mongoose.Schema.ObjectId,
//               ref: 'Product',
//               required: true,
//               }
// justOne -> para q me devuelva una lista
//
// si quisiera solo las reviews donde el rating es = a 5
// ProductSchema.virtual('reviews', {
//    ref: 'Review',
//    localField: '_id',
//    foreignField: 'product',
//    justOne: false,
//    match: { rating: 5 },
// });
//
// como este va a ser virtual => no se le van a poder hacer queries , o sea poner algo como .populate('reviews').findOne({ id: algo })
