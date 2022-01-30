const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
   const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
   });

   return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
   const token = createJWT({ payload: user });

   // 🔥 cookie 🍪 para añadirla a la respuesta, SOLO AÑADE LA COOKIE A LA RESPONSE, LUEGO EN LOS CONTROLLERS MANDO LA RESPUESTA CON LAS COOKIES Q SE PONENE ACÁ
   const oneDay = 1000 * 60 * 60 * 24;
   res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
   });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };

//
// secure va de esa forma xq necesita q sea https y en development tenemos http
// signed es para q revise q sea con mi firma y no la vallan a alterar,la defino en app.js donde pongo q ocupe "cookieParser" como middleware "app.use(cookieParser(process.env.JWT_SECRET))", COMO VA A ESTAR FIRMADA LA COOKIE => YA NO VA A ESTAR EN REQ.COOKIES, SINO EN "REQ.SIGNEDcOOKIES"

// 🍪🍪🍪🍪
// 🔥 acerca de las cookies en la documentación de Express.js
// para añadirla a la respuesta
//
// res.cookie(name, value [, options])
// Sets cookie name to value. The value parameter may be a string or object converted to JSON.
//
// The options parameter is an object that can have the following properties.
//
// Property	Type	Description
// domain	String	Domain name for the cookie. Defaults to the domain name of the app.
// encode	Function	A synchronous function used for cookie value encoding. Defaults to encodeURIComponent.
// expires	Date	Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
// httpOnly	Boolean	Flags the cookie to be accessible only by the web server.
// maxAge	Number	Convenient option for setting the expiry time relative to the current time in milliseconds.
// path	String	Path for the cookie. Defaults to “/”.
// secure	Boolean	Marks the cookie to be used with HTTPS only.
// signed	Boolean	Indicates if the cookie should be signed.
//
// All res.cookie() does is set the HTTP Set-Cookie header with the options provided. Any option not specified defaults to the value stated in RFC 6265.

//  🍪🍪🍪🍪🍪
// para acceder a la cookie, uso el package cookie-parser, hago el require en app.js
// el middleware q pongo en app.js para el acceso a la cookie
// app.use(cookieParser()); // 🍪🍪🍪 me da acceso a la cookie en req.cookies
// app.use(cookieParser()); // 🍪🍪🍪  con el middleware de cookie-parser => cada ves q el browser mande un req ( con la cookie ) voy a tener acceso "a la cookie" en req.cookie, => UNA VEZ Q LA CREO, EN EL AUTHCONTROLLER ( Q ES MUUUUUUY SENCILLO ) Y LA MANDO COMO RESPUESTA ( res.cookie() ), YA EL BROWSER LA VA A PASAR EN TODOS LOS REQS. 😎😎😎
