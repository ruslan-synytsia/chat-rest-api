require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { name: serviceName, version: serviceVersion } = require('./package.json');

const authRouter = require('./components/routers/authRouter');
const chatRouter = require('./components/routers/chatRouter');
const usersRouter = require('./components/routers/usersRouter');

const app = express();

const requiredEnv = ['DB_MONGO_URI', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length) {
  console.error(`Missing required env vars: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).json({
    service: serviceName,
    status: 'ok',
    version: serviceVersion,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connecting to MongoDB database via Mongoose
// ===================================================================================
mongoose.connect(process.env.DB_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successful connection to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

app.use('/api', authRouter);
app.use('/api', chatRouter);
app.use('/api', usersRouter);

app.listen(PORT, () => {
  console.log(`The server is running on the port ${PORT}`);
});
