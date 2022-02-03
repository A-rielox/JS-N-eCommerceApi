const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
   const { product: productId } = req.body;
   const { userId } = req.user;
   req.body.user = userId;

   const isValidProduct = await Product.findOne({ _id: productId });
   if (!isValidProduct) {
      throw new NotFoundError(`No product with id: ${productId}`);
   }

   const alreadySubmitted = await Review.findOne({
      product: productId,
      user: userId,
   });

   if (alreadySubmitted) {
      throw new BadRequestError('Already submitted review for this product');
   }

   const review = await Review.create(req.body);

   res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
   const reviews = await Review.find({}).populate({
      path: 'product',
      select: 'name company price',
   }); // 🍑

   res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
   const { id: reviewId } = req.params;

   const review = await Review.findOne({ _id: reviewId });
   if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
   }

   res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
   const { id: reviewId } = req.params;
   const { rating, title, comment } = req.body;

   if (!rating || !title || !comment) {
      throw new BadRequestError('Please provide rating, title and comment');
   }

   const review = await Review.findOne({ _id: reviewId });

   if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
   }

   // el id "mio" de cuando me autenticaron, y el userId del recurso q estoy pidiendo, para q solo si yo creé esta review entonces la pueda actualizar
   // la fcn solo va a dejar pasar si coinciden las id's, si no, tira error y se sale ( yo no sige con el resto del delete)
   checkPermissions(req.user, review.user);
   review.rating = rating;
   review.title = title;
   review.comment = comment;
   await review.save();

   res.status(StatusCodes.OK).json({ msg: 'Successfully updated review' });
};

const deleteReview = async (req, res) => {
   const { id: reviewId } = req.params;

   const review = await Review.findOne({ _id: reviewId });

   if (!review) {
      throw new NotFoundError(`No review with id: ${reviewId}`);
   }

   checkPermissions(req.user, review.user);

   await review.remove();

   res.status(StatusCodes.OK).json({ msg: 'Successfully deleted review' });
};

module.exports = {
   createReview,
   getAllReviews,
   getSingleReview,
   updateReview,
   deleteReview,
};

// 🍑
// .populate()
// nos permite referenciar documentos en otras colecciones

// en las reviews tengo

// const ReviewSchema = new mongoose.Schema(
//    {
//       rating: {...},
//       title: {...},
//       comment: {...}
//       /* NO ocupa type: mongoose.Types.ObjectId,  */,
//       user: {
//          type: mongoose.Schema.ObjectId,
//          ref: 'User',
//          required: true,
//       },
//       product: {
//          type: mongoose.Schema.ObjectId,
//          ref: 'Product',
//          required: true,
//       },
//    },
//    { timestamps: true }
// );
// con esto hago el link a las colecciones de "users" y "products"

// entonces en el reviewController.js puedo:

// const getAllReviews = async (req, res) => {
//    const reviews = await Review.find({}).populate({
//       path: 'product',
//       select: 'name company price',
//    });

//    res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
// };

// donde el "path: 'product'" hace referencia al "ref: 'Product'" del ReviewSchema y hace q busque en la coleccion "products'; y el "select: 'name company price' es para q busque estas propiedades en la coleccion de "products" y como en "type: mongoose.Schema.ObjectId" esta ligando al _id del product => ya sabe de cual traer las props
