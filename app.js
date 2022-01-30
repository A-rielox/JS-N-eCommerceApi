require('dotenv').config();
require('express-async-errors'); // 🙀

const express = require('express');
const app = express();

const morgan = require('morgan'); // 🥝

//===== DB
const connectDB = require('./db/connect');

// ===== routers
const authRouter = require('./routes/authRoutes');

//===== ERROR HANDLER
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.use(morgan('tiny')); // 🥝
app.use(express.json()); // 🐸

app.get('/', (req, res) => {
   res.send('Ruta base a e-commerce-api');
});

// ===== routes
app.use('/api/v1/auth', authRouter);

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
// 🥝 para obtener la info acerca del req q se hizo ( GET / 200 26 - 0.460 ms )

//
// 🙀  "express-async-errors"
// para no tener q hacer al "asyncWrapper" para envolver a las funciones de los controladores ( q me evitaba ponerle a todas con try-catch )
// se importa aquí en app.js
//
// con este package, si salta un error en algun controlador => se va a poder acceder al error en el "custom errorhandler" q está en /middleware/error-handler.js

//
// 🐸 para tener acceso a la data en formato json en el req.body, ya q se van a tener varios request post y patch donde se van a necesitar estos valores
