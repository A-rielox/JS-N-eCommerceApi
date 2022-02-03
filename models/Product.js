const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         trim: true,
         required: [true, 'Please provide a product name'],
         maxlength: [100, 'Name can not be more than 100 characters'],
      },
      price: {
         type: Number,
         required: [true, 'Please provide a product price'],
         default: 0,
      },
      description: {
         type: String,
         required: [true, 'Please provide a product description'],
         maxlength: [1000, 'Description can not be more than 1000 characters'],
      },
      image: {
         type: String,
         default: '/uploads/example.jpg', // 🔔
      },
      category: {
         type: String,
         required: [true, 'Please provide a product category'],
         enum: ['office', 'kitchen', 'bedroom'],
      },
      company: {
         type: String,
         required: [true, 'Please provide a product company'],
         enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported',
         },
      },
      colors: {
         type: [String],
         default: ['#222'],
         required: true,
      },
      featured: {
         type: Boolean,
         default: false,
      },
      freeShipping: {
         type: Boolean,
         default: false,
      },
      inventory: {
         type: Number,
         required: true,
         default: 15,
      },
      averageRating: {
         type: Number,
         default: 0,
      },
      user: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: true,
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);
// 🍑
ProductSchema.virtual('reviews', {
   ref: 'Review',
   localField: '_id',
   foreignField: 'product',
   justOne: false,
});

module.exports = mongoose.model('Product', ProductSchema);

// 🔔
// para tener una imagen default x si no proveen una, apunta a la carpeta "uploads" dentro de "public"

// 🍑
// en getSingleProduct ( del controller ) no se puede hacer directamente ".populate('reviews')" xq el  product no está conectado a las reviews ( en el ProductSchema no tengo una prop con type: mongoose.Type.ObjectId y ref: 'Review' ), para esto se utilizan los "virtuals", estas props se crean "on-the-fly" ( no estan almacenadas en algun lugar )
//
//para esto en el ProductSchema agrego :
// con el "toJSON y toObject" es q le permito a este modelo aceptar virtuals

// para crear la propiedad virtual,
// el parametro 'reviews" es xq acá llamo ".populate('reviews')"
// ref: 'Review' -> para ocupar los documentos de reviews ( los ducumentos q ocupan el modelo 'Review' , q son los de la coleccion "reviews" )
// "localField: '_id'" -> el parametro local q ocupo para buscar en esa coleccion
// foreignField: 'product' -> el parametro en esa colleccion contra el cual hacer el match ( en ReviewSchema tengo product: {
//               type: mongoose.Schema.ObjectId,
//               ref: 'Product',
//               required: true,
//               }
// justOne -> para q me devuelva una lista
//
// si quisiera solo las reviews donde el rating es = a 5
// ProductSchema.virtual('reviews', {
//    ref: 'Review',
//    localField: '_id',
//    foreignField: 'product',
//    justOne: false,
//    match: { rating: 5 },
// });
