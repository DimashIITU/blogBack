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
import { METHODS } from 'http';

mongoose
  .connect(
    'mongodb+srv://blogAdmin:blogAdminPassword@cluster0.wd2jvuc.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('getted'));

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
app.use(
  cors({
    origin: 'https://blog-front-phi.vercel.app',
    METHODS: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  }),
);
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
