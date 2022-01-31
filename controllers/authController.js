const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
   // console.log(req.body); // { name: 'pepithor', email: 'sully@sully.com', password: 'maimlb2006' }
   const { email, name, password } = req.body;

   // forma de poner para q el primer user sea el admin
   const isFirstAccount = (await User.countDocuments({})) === 0;
   const role = isFirstAccount ? 'admin' : 'user';

   const user = await User.create({ email, name, password, role }); // 💥

   const tokenUser = createTokenUser(user);

   //===== Cookie , solo añade la cookie con el token a la res
   attachCookiesToResponse({ res, user: tokenUser });

   // manda la res ya con la cookie añadida
   res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      throw new BadRequestError('Please provide an email and password');
   }

   const user = await User.findOne({ email });
   if (!user) {
      throw new UnauthenticatedError('Invalid credential');
   }

   const isPasswordCorrect = await user.comparePassword(password);
   if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid credential');
   }

   const tokenUser = createTokenUser(user);
   attachCookiesToResponse({ res, user: tokenUser });

   // manda la res ya con la cookie añadida
   res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
   res.cookie('token', 'Logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === 'production',
      // signed: true,
   });

   res.status(StatusCodes.OK).json({ msg: 'User logged out successfully' });
};

module.exports = { register, login, logout };

//
// 💥 las paso así para asegurarme, de q aunque por el front no se va a poder pasar el "role", q no lo vayan a meter en el req.body y lo pongan como admin ( no pasar {...req.body} )
// en la original no pasaba el role xq no lo determinaba así
