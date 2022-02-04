const Order = require('../models/order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const {
   BadRequestError,
   UnauthenticatedError,
   NotFoundError,
} = require('../errors');
const { checkPermissions } = require('../utils');

// 💲
const fakeStripeAPI = async ({ amount, currency }) => {
   const client_secret = 'someRandomValue';
   return { client_secret, amount };
};

const createOrder = async (req, res) => {
   const { items: cartItems, tax, shippingFee } = req.body;

   if (!cartItems || cartItems.length < 1) {
      throw new BadRequestError('No cart items provided');
   }
   if (!tax || !shippingFee) {
      throw new BadRequestError('No tax or shipping fee provided');
   }

   // como se necesita un await dentro del loop => no se va a poder hacer ni forEach ni map, va a tener q ser for-of
   let orderItems = [];
   let subtotal = 0;

   for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.product });

      if (!dbProduct) {
         throw new NotFoundError(`No product with id: ${item.product}`);
      }

      const { name, price, image, _id } = dbProduct;
      //creando el SingleCartItemSchema q está en el orderSchema
      const singleOrderItem = {
         amount: item.amount,
         name,
         price,
         image,
         product: _id,
      };
      // add item to order
      orderItems = [...orderItems, singleOrderItem];
      //calculate subtotal
      subtotal += item.amount * price;
   }

   // 💲 parte para stripe
   const total = tax + shippingFee + subtotal;
   // 💲 get client secret ( fake )
   const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: 'usd',
   });

   const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.client_secret,
      user: req.user.userId,
   });

   res.status(StatusCodes.CREATED).json({
      order,
      clientSecret: order.clientSecret,
   });
};

const getAllOrders = async (req, res) => {
   res.send('get all orders');
};

const getSingleOrder = async (req, res) => {
   res.send('get single order');
};

const getCurrentUserOrders = async (req, res) => {
   res.send('get current user orders');
};

const updateOrder = async (req, res) => {
   res.send('update order');
};

module.exports = {
   getAllOrders,
   getSingleOrder,
   getCurrentUserOrders,
   createOrder,
   updateOrder,
};
