import express from 'express';
import multer from 'multer';
import cors from 'cors';

export let fileUploadRouter = express.Router();
const SERVER_HOSTNAME = 'http://localhost:4201';
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/product_images/');
  },
  filename: (req, file, cb) => {
    // TODO: Dangerous to take file name from client
    cb(null, file.originalname);
  }
});

fileUploadRouter.use(multer({storage: multerStorage}).single('productImage'));

fileUploadRouter.use(cors({ origin: SERVER_HOSTNAME}));

fileUploadRouter.post('/', (req, res) => {
  // TODO: add uploaded files to DB to track them down
  res.sendStatus(200);
});
