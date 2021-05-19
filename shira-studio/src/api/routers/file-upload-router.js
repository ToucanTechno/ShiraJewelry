const express = require('express');
const multer = require('multer');
const cors = require('cors');

let fileUploadRouter = express.Router();
const SERVER_HOSTNAME = 'http://localhost:4201';
let multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/product_images')
  },
  filename: (req, file, cb) => {
    // TODO: Dangerous to take file name from client
    cb(null, file.originalname);
  }
});

fileUploadRouter.use(multer({storage: multerStorage}).single('productImage'));

fileUploadRouter.use(cors({ origin: SERVER_HOSTNAME}))

fileUploadRouter.post('/', (req, res) => {
  res.sendStatus(200);
})

module.exports = fileUploadRouter;
