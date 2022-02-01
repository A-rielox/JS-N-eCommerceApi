const Product = require('../models/Product');

const createProduct = async (req, res) => {
   res.send('Create Product Route');
};

const getAllProducts = async (req, res) => {
   res.send('Get All Products Route');
};

const getSingleProduct = async (req, res) => {
   res.send('Get Single Product Route');
};

const updateProduct = async (req, res) => {
   res.send('Update Product Route');
};

const deleteProduct = async (req, res) => {
   res.send('Delete Product Route');
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
