// '/api/v1/products'
const express = require('express');
const router = express.Router();
const {
   authenticateUser,
   authorizePermissions,
} = require('../middleware/authentication');
const {
   createProduct,
   getAllProducts,
   getSingleProduct,
   updateProduct,
   deleteProduct,
   uploadImage,
} = require('../controllers/productController');

router
   .route('/')
   .get(getAllProducts)
   .post(authenticateUser, authorizePermissions('admin'), createProduct);

router
   .route('/uploadImage')
   .post(authenticateUser, authorizePermissions('admin'), uploadImage);

// ===== al final
router
   .route('/:id')
   .get(getSingleProduct)
   .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
   .delete(authenticateUser, authorizePermissions('admin'), deleteProduct);

module.exports = router;
