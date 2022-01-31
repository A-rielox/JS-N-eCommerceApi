const { UnauthorizedError } = require('../errors');

// el id "mio" de cuando me autenticaron, y el q estoy pidiendo ( q está en el user )
const checkPermissions = (requestUser, resourceUserId) => {
   // console.log(requestUser);
   // console.log(resourceUserId);
   // console.log(typeof resourceUserId); // es un object, no string con id

   if (requestUser.role === 'admin') return;
   if (requestUser.userId === resourceUserId.toString()) return;

   throw new UnauthorizedError('Not authorized to access this route');
};

module.exports = checkPermissions;
