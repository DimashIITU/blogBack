import cors from 'cors';
const cors = require('cors');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-Width', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
module.exports = cors(corsOptions);
