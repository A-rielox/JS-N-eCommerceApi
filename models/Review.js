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

// ⭐
ReviewSchema.statics.calculateAverageRating = async function (productId) {
   console.log(productId);
};

ReviewSchema.post('save', async function () {
   await this.constructor.calculateAverageRating(this.product);
   // el product de este schema tiene el id del producto
});

ReviewSchema.post('remove', async function () {
   await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);

//
// ⭐
// la diferencia con los métodos ( q se llaman en las instacias como de user o de product ), los "statics" se llaman en el Schema , en el user-model tengo el modelo:
// UserSchema.methods.comparePassword = async function (candidatePassword) {
//    const isMatch = await bcrypt.compare(candidatePassword, this.password);

//    return isMatch;
// };
// q llamo en las instancias de los users para comparar los pass
//
// estos los estoy llamando en un post o pre con el trigger "save" y "remove", xeso en el reviewController ocupo "review.save()" en updateReview y "review.remove()" en deleteReview, PARA Q SE LLAMEN ESTOS POST('SAVE',...) Y POST('REMOVE',...)

//
// 🔥
// cuando se hacia q el "email" fuera "unique: true" --> se hacia q fuera el index de ese modelo, ( de la DB de usuarios ), en este caso se necesita un "compound index", xq tiene q tener "producto" y "user"
