const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');

const getAllUsers = async (req, res) => {
   console.log(req.user);
   // para q no pase el campo de password al users
   const users = await User.find({ role: 'user' }).select('-password');

   res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
   // req.params { "id": "@#$%#^" }
   const { id: _id } = req.params;

   const user = await User.findOne({ _id }).select('-password');

   if (!user) {
      throw new NotFoundError(`No user with id: ${_id}`);
   }

   res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
   res.send('show current user route');
};

const updateUser = async (req, res) => {
   res.send(req.body);
};

const updateUserPassword = async (req, res) => {
   res.send(req.body);
};

module.exports = {
   getAllUsers,
   getSingleUser,
   showCurrentUser,
   updateUser,
   updateUserPassword,
};
