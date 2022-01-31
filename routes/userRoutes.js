// '/api/v1/users'
const express = require('express');
const router = express.Router();
const {
   authenticateUser,
   authorizePermissions,
} = require('../middleware/authentication');

const {
   getAllUsers,
   getSingleUser,
   showCurrentUser,
   updateUser,
   updateUserPassword,
} = require('../controllers/userController');

router
   .route('/')
   .get(authenticateUser, authorizePermissions('admin'), getAllUsers); // ⭐

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser); // 🍑

module.exports = router;

// 🍑 tiene q estar al final para q no me mande a las otras rutas, ya q consideraria q lo q está despues del "/" es el param ( y la q ponga despues de esta  se agarraria acå )

// ⭐
// primero tiene q ir "authenticateUser" y luego "authorizePermissions" x q en authenticateUser es q se pone el role en el req.body
