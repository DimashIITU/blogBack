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
  getAllPopular,
  getByTagPopular,
  getComments,
  getLastComments,
  postComment,
} from './controllers/index.js';
import { getByTag } from './controllers/PostController.js';

mongoose
  // mongodb+srv://blogAdmin:blogAdminPassword@cluster0.wd2jvuc.mongodb.net/blog?retryWrites=true&w=majority
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('getted'));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
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
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-Width', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  }),
);
app.options('*', cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.post('/auth/login', loginValidator, handleValidationErrors, login);
app.post('/auth/register', registerValidator, handleValidationErrors, register);
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, create);
app.post('/comment/add', checkAuth, postComment);

app.get('/posts/?category=0', postCreateValidator, getAll);
app.get('/posts/?category=1', postCreateValidator, getAllPopular);
app.get('/tags', getLastTags);
app.get('/posts/:id', postCreateValidator, getOne);
app.get('/tags/search?category=0/:tag', postCreateValidator, getByTag);
app.get('/tags/search?category=1/:tag', postCreateValidator, getByTagPopular);
app.get('/auth/me', checkAuth, getMe);
app.get('/comments', getComments);
app.get('/comments/preview', getLastComments);

app.delete('/posts/:id', checkAuth, remove);

app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, update);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('work');
});
