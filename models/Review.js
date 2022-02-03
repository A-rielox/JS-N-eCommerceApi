const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
   {
      rating: {
         type: Number,
         min: 1,
         max: 5,
         required: [true, 'Please provide a rating'],
      },
      title: {
         type: String,
         trim: true,
         required: [true, 'Please provide a review title'],
         maxlength: 100,
      },
      comment: {
         type: String,
         required: [true, 'Please provide a review text'],
      } /* NO ocupa type: mongoose.Types.ObjectId,  */,
      user: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: true,
      },
      product: {
         type: mongoose.Schema.ObjectId,
         ref: 'Product',
         required: true,
      },
   },
   { timestamps: true }
);

// para q se pueda dejar solo una review por c/user en cada producto 🔥 ( un ser puede dejar solo 1 review por product )
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);

//
// 🔥
// cuando se hacia q el "email" fuera "unique: true" --> se hacia q fuera el index de ese modelo, ( de la DB de usuarios ), en este caso se necesita un "compound index", xq tiene q tener "producto" y "user"
