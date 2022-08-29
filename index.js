import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';

import mongoose from 'mongoose';
import { postCreateValidator, registerValidator } from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { loginValidator } from './validations.js';
import {
  getMe,
  login,
  register,
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags,
} from './controllers/index.js';

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('getted'));

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers['origin']);
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST, DELETE,OPTIONS');
  next();
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  next();
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.post('/auth/login', loginValidator, handleValidationErrors, login);
app.post('/auth/register', registerValidator, handleValidationErrors, register);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, create);
app.get('/posts', postCreateValidator, getAll);
app.get('/tags', getLastTags);
app.get('/posts/:id', postCreateValidator, getOne);
app.get('/auth/me', checkAuth, getMe);

app.delete('/posts/:id', checkAuth, remove);

app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, update);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server work');
});
