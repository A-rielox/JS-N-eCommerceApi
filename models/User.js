const mongoose = require('mongoose');
const validator = require('validator'); // 🥊

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: 3,
      maxlength: 50,
   },
   email: {
      type: String,
      required: [true, 'Please provide an email'],
      validate: {
         validator: validator.isEmail,
         message: 'Please provide a valid email',
      },
   },
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
   },
   role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
   },
});

module.exports = mongoose.model('User', UserSchema);

//
// 🥊 paquete para pasarle a la fcn y q me valide el mail, lo de la fcn lo sequé de la documentación. ".isEmail" es la fcn q viene en el package de "validator" para validar el email.
//
// Custom Validators
// If the built-in validators aren't enough, you can define custom validators to suit your needs.
//
// Custom validation is declared by passing a validation function. You can find detailed instructions on how to do this in the SchemaType#validate() API docs.
//
// const userSchema = new Schema({
//   phone: {
//     type: String,
//     validate: {
//       validator: function(v) {
//         return /\d{3}-\d{3}-\d{4}/.test(v);
//       },
//       message: props => `${props.value} is not a valid phone number!`
//     },
//     required: [true, 'User phone number required']
//   }
// });
