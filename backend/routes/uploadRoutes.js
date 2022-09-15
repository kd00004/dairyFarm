import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';

const upload = multer(); //its a package to handle uploading files to server

const uploadRouter = express.Router();

uploadRouter.post(
  //post because we are going to generate a new record
  '/',
  isAuth,
  isAdmin,
  upload.single('file'), //upload single file and name of that file in payload is file
  async (req, res) => {
    //handler for the api
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req); //calling the function
    res.send(result);
  }
);
export default uploadRouter;
