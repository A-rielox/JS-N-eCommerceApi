const { UnauthenticatedError, UnauthorizedError } = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
   const token = req.signedCookies.token;

   if (!token) {
      throw new UnauthenticatedError('Authentication invalid');
   }

   try {
      const { name, userId, role } = isTokenValid({ token });
      req.user = { name, userId, role };

      next();
   } catch (error) {
      throw new UnauthenticatedError('Authentication invalid');
   }
};

// puedo acceder al role xq 1ro pasa por el middleware de authenticateUser
const authorizePermissions = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         throw new UnauthorizedError('Unauthorized to access this route');
      }
      next();
   };
};

module.exports = { authenticateUser, authorizePermissions };

// 🍪
// COMO VA A ESTAR FIRMADA LA COOKIE => YA NO VA A ESTAR EN REQ.COOKIES, SINO EN "REQ.SIGNEDcOOKIES"
// token es el nombre q se le dio a la cookie ( jwt.js )

// antes del refactor cuando a la fcn authorizePermissions no le pasaba argumentos en la ruta, HAY q refactorizar para q devuelva otra fcn para q no se ejecute en el mismo archivo de las rutas
//
// const authorizePermissions = (req, res, next) => {
//    if (req.user.role !== 'admin') {
//       throw new UnauthorizedError('Unauthorized to access this route');
//    }

//    next();
// };
