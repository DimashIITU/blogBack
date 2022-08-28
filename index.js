import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

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

app.use(express.json());
app.use(cors());
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
