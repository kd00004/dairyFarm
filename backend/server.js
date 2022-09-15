import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import cors from 'cors';
//import Razorpay from 'razorpay';;

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI) //this returns a promise
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express(); //this returns an object which is a app

// //app.get() is a method and it has 2 components first the URL we are going to serve and
// //second the function that responds to the URL which is a callback function, they are
// //MIDDLEARE FUNCTION->function that will have all the access for requesting an object,
// // responding to an object, and moving to the next middleware function in the application
// // request-response cycle . CALLBACK FUNCTION-> Any function that is passed as an argument
// // to another function so that it can be executed in that other function is called as a callback function
// //GET REQUEST->a way for you to grab data from a data source with the help of the internet

//by having next two lines the form data in the post request will be converted to json object inside req.body

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//by using above two lines the form data in the post request will be converted to JSON object inside req.body

app.use(cors());

//following are the various APIs that we have used
app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter); //first parameter is path of seed api
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

//error handler for express which is middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`); //we have use backtick because we have to use a variable
}); //the server starts and is ready to response to frontend
