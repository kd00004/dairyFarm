//to save an order we have created this orderRoutes
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_CLIENT_ID,
//   key_secret: process.env.RAZORPAY_CLIENT_SECRET,
// });

const orderRouter = express.Router();

orderRouter.get(
  //api to return all orders
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.post(
  //when we send post request to /api/orders this function will respond
  '/',
  isAuth, //it is a middleware function
  expressAsyncHandler(async (req, res) => {
    //used to catch all errors
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      //map is used to convert _id to product because in the orderModel for each item we have product
      //and we have to fill the id of each product in this field and therefore we are using map function
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id, //isAuth is responsible to fill the user of the request
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
    //we have order._id in the frontend
  })
);

orderRouter.get(
  '/summary',
  isAuth, //for authenticated and admin users
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      //aggregate is from mongoDB, each object is a pipeline
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 }, //calculate number of users in User collection
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine', //it should be before '/:id'
  isAuth, //its a middleware
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.post(
  '/:id/pay',
  expressAsyncHandler(async (req, res) => {
    try {
      const options = {
        amount: req.body.totalPrice * 100, // amount in smallest currency unit
        currency: 'INR',
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send('Some error occured');
      // console.log(order);

      res.json(order);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  })
);

orderRouter.post(
  '/:id/pay/success',
  expressAsyncHandler(async (req, res) => {
    try {
      // getting the details back from our font-end
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;

      console.log(req.body);

      // Creating our own digest
      // The format should be like this:
      // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
      const shasum = crypto.createHmac(
        'sha256',
        process.env.RAZORPAY_CLIENT_SECRET
      );

      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

      const digest = shasum.digest('hex');

      // comaparing our digest with the actual signature
      if (digest !== razorpaySignature) {
        return res.status(400).json({ msg: 'Transaction not legit!' });
      }

      // THE PAYMENT IS LEGIT & VERIFIED
      // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        const d = new Date();
        order.paidAt = d;
        order.paymentResult = {
          razorpayPaymentId: razorpayPaymentId,
          orderCreationId: orderCreationId,
          razorpayOrderId: razorpayOrderId,
          status: 'success',
        };
      }

      const updatedOrder = await order.save();
      console.log(updatedOrder);

      res.send({ message: 'Order paid', order: updatedOrder });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //we will search for this order in the database and return it to the frontend
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default orderRouter;
