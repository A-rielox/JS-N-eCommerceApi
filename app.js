require('dotenv').config();
require('express-async-errors'); // 🙀

const express = require('express');
const app = express();

// ===== para ver el archivo (imagen) en el req en la propiedad file, tambien poder mover el archivo y poder arregla todo para tener el temp directory
const fileUpload = require('express-fileupload');
// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//    cloud_name: process.env.CLOUD_NAME,
//    api_key: process.env.CLOUD_API_KEY,
//    api_secret: process.env.CLOUD_API_SECRET,
// });

const morgan = require('morgan'); // 🥝
const cookieParser = require('cookie-parser'); // 🍪🍪🍪
//===== DB
const connectDB = require('./db/connect');

// ===== routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

//===== ERROR HANDLER
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.use(morgan('tiny')); // 🥝
app.use(express.json()); // 🐸
app.use(cookieParser(process.env.JWT_SECRET)); // 🍪🍪🍪 me da acceso a la cookie en req.cookies
app.use(express.static('./public')); // 🐱 para la imagen
app.use(fileUpload(/* { useTempFiles: true } */)); // para ver el archivo (imagen) en el body, y arregle para tener el temp

app.get('/api/v1', (req, res) => {
   // console.log(req.cookies); xq ahora está firmada
   console.log(req.signedCookies);
   res.send('Ruta base a e-commerce-api');
});

// ===== routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

// ===== not-found & error
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// @@@@@@@@@@@@@@@@@@@@ APP LISTEN
const port = process.env.PORT || 5000;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URL);

      app.listen(port, () =>
         console.log(`Server listening on port ${port}...😎`)
      );
   } catch (error) {
      console.log(error);
   }
};

start();

//
// app.use(cookieParser()); // 🍪🍪🍪  con el middleware de cookie-parser => cada ves q el browser mande un req ( con la cookie ) voy a tener acceso "a la cookie" en req.cookie, => UNA VEZ Q LA CREO, EN EL AUTHCONTROLLER ( Q ES MUUUUUUY SENCILLO ) Y LA MANDO COMO RESPUESTA ( res.cookie() ), YA EL BROWSER LA VA A PASAR EN TODOS LOS REQS. 😎😎😎
// COMO VA A ESTAR FIRMADA LA COOKIE => YA NO VA A ESTAR EN REQ.COOKIES, SINO EN "REQ.SIGNEDcOOKIES"

//
// 🥝 para obtener la info acerca del req q se hizo ( GET / 200 26 - 0.460 ms )

//
// 🙀  "express-async-errors"
// para no tener q hacer al "asyncWrapper" para envolver a las funciones de los controladores ( q me evitaba ponerle a todas con try-catch )
// se importa aquí en app.js
//
// con este package, si salta un error en algun controlador => se va a poder acceder al error en el "custom errorhandler" q está en /middleware/error-handler.js

//
// 🐸 para tener acceso a la data en formato json en el req.body, ya q se van a tener varios request post y patch donde se van a necesitar estos valores
