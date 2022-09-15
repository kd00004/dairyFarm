//routes is created because we are going to make the api in the backend

//used to create sample data

import express from 'express'; //we will create route from express-router
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

const seedRouter = express.Router(); //this creates a route , seedRouter is an object from express.Router fucntion

seedRouter.get('/', async (req, res) => {
  await Product.remove({}); //remove all previous records in the productModel
  const createdProducts = await Product.insertMany(data.products);
  //products are coming from data.js, we have called insertMany to insert an array of products
  //to the product model in the database
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers }); //send to the frontend
});
export default seedRouter;
//we use seedRouter in server.js
