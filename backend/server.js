require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// PWA
app.use(express.static(path.join(__dirname, '../frontend')));
// PWA

// API routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/pesanan'));

// FRONTEND
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// app.listen(3000, '0.0.0.0',() => {
//   console.log('Server running on http://localhost:3000');
// });
