import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import './database/mongoose.js';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import userRouter from '../src/routers/userRouter.js';
import productRouter from '../src/routers/productRouter.js';
import orderRouter from '../src/routers/orderRouter.js';
import cartRouter from '../src/routers/cartRouter.js';
import router from '../src/routers/warehouseRouter.js';
import vouchersRouter from '../src/routers/vouchersRouter.js';
import serviceRouter from '../src/routers/serviceRouter.js';
import warehouseRouter from '../src/routers/warehouseRouter.js';
import serviceTypeRouter from '../src/routers/serviceTypeRouter.js';
import loginRouter from '../src/routers/LoginRouter.js';
import paymentRouter from '../src/routers/paymentRouter.js';
import reviewRouter from '../src/routers/reviewRouter.js';
import googleRoutes from '../src/routers/googleRoutes.js';
import morgan from 'morgan';
import connect from './database/mongoose.js';
//cấu hình để upload ảnh lên firebase
import { initializeApp } from 'firebase/app';
import historyOrderRouter from './routers/historyOrderRouter.js';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

app.use(express.json());
//Router:
app.use(productRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(historyOrderRouter);
app.use(cartRouter);
app.use(router);
app.use(vouchersRouter);
app.use(warehouseRouter);
app.use(serviceRouter);
app.use(loginRouter);
app.use(serviceTypeRouter);
app.use(paymentRouter);
app.use(reviewRouter);
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
app.use('/google', googleRoutes);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

connect()
  .then(function () {
    app.listen(port, () => {
      console.log('Server is up on PORT ' + port);
    });
  })
  .catch(function (error) {
    console.log(error);
  });