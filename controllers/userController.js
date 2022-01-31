const User = require('../models/User');
const {
   attachCookiesToResponse,
   createTokenUser,
   checkPermissions,
} = require('../utils');
const { StatusCodes } = require('http-status-codes');
const {
   NotFoundError,
   BadRequestError,
   UnauthenticatedError,
} = require('../errors');

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

   // el id "mio" de cuando me autenticaron, y el q estoy pidiendo ( q está en el user ), se ocupa para q solo si eres admin puedas ver a otro usuario, o si es tu info la q estas pidiendo
   checkPermissions(req.user, user._id);

   res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
   res.status(StatusCodes.OK).json({ user: req.user });
};

// update user with user.save()
// volvia a hashear el pass y no me podia logear, arreglado en .pre('save') y ya no lo hashea denuevo
const updateUser = async (req, res) => {
   const { email, name } = req.body;
   if (!email || !name) {
      throw new BadRequestError('Please provide email and name');
   }

   const user = await User.findOne({ _id: req.user.userId });
   user.email = email;
   user.name = name;
   await user.save();

   const tokenUser = createTokenUser(user);
   attachCookiesToResponse({ res, user: tokenUser });

   res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
   const { oldPassword, newPassword } = req.body;
   if (!oldPassword || !newPassword) {
      throw new BadRequestError('Please provide old and new passwords');
   }

   const user = await User.findOne({ _id: req.user.userId });

   const isPasswordCorrect = await user.comparePassword(oldPassword);
   if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid credential');
   }

   user.password = newPassword;
   await user.save();

   res.status(StatusCodes.OK).json({ msg: 'Password changed successfully' });
};

module.exports = {
   getAllUsers,
   getSingleUser,
   showCurrentUser,
   updateUser,
   updateUserPassword,
};

// update user with findOneAndUpdate
// volvia a hashear el pass con el otro método de user.save() y no me podia logear, arreglado en .pre('save') y ya no lo hashea denuevo, CON ESTE MÉTODO NO SE HASHEAVA DENUEVO XQ HO HACE EL TRIGGER DE 'SAVE'
/*
const updateUser = async (req, res) => {
   const { email, name } = req.body;
   if (!email || !name) {
      throw new BadRequestError('Please provide email and name');
   }

   const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      req.body,
      { new: true, runValidators: true }
   );

   const tokenUser = createTokenUser(user);
   attachCookiesToResponse({ res, user: tokenUser });

   res.status(StatusCodes.OK).json({ user: tokenUser });
};
*/
