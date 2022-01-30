const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { attachCookiesToResponse } = require('../utils');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
   // console.log(req.body); // { name: 'pepithor', email: 'sully@sully.com', password: 'maimlb2006' }
   const { email, name, password } = req.body;

   // forma de poner para q el primer user sea el admin
   const isFirstAccount = (await User.countDocuments({})) === 0;
   const role = isFirstAccount ? 'admin' : 'user';

   //===== crea usuario en DB
   const user = await User.create({ email, name, password, role }); // 💥

   //===== Token
   const tokenUser = { name: user.name, userId: user._id, role: user.role }; // para no tener q pasar todo el user a la fcn q crea el token

   //===== Cookie , solo añade la cookie con el token a la res
   attachCookiesToResponse({ res, user: tokenUser });

   // manda la res ya con la cookie añadida
   res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
   res.send('User login');
};

const logout = async (req, res) => {
   res.send('User logout');
};

module.exports = { register, login, logout };

//
// 💥 las paso así para asegurarme, de q aunque por el front no se va a poder pasar el "role", q no lo vayan a meter en el req.body y lo pongan como admin ( no pasar {...req.body} )
// en la original no pasaba el role xq no lo determinaba así
