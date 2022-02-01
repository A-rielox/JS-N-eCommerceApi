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

   const product = await Product.findOne({ _id: productId });
   if (!product) {
      throw new NotFoundError(`No product with id: ${productId}`);
   }

   res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
   // const {
   //    body: { name, price, description, category, company },
   //    params: { id: productId },
   // } = req;

   // if (
   //    !name === '' ||
   //    !price === '' ||
   //    !description === '' ||
   //    !category === '' ||
   //    !company === ''
   // ) {
   //    throw new BadRequestError('Please provide company and position');
   // }
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

   await product.remove(); // explicacion pendiente

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
