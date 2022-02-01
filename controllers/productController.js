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

const uploadImage = async (req, res) => {
   res.send('Upload Image Route');
};

module.exports = {
   createProduct,
   getAllProducts,
   getSingleProduct,
   updateProduct,
   deleteProduct,
   uploadImage,
};
