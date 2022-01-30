const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
   res.send('User register');
};

const login = async (req, res) => {
   res.send('User login');
};

const logout = async (req, res) => {
   res.send('User logout');
};

module.exports = { register, login, logout };
