require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer'); // For handling file uploads
const cors = require('cors');

const { PORT, PASS, EMAIL } = process.env;

const app = express();
const upload = multer(); // Initialize multer

// Convert request body to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://sibusky.github.io/proelectro/',
      'https://sibusky.github.io/proelectro',
      'https://sibusky.github.io/',
      'https://sibusky.github.io/',
      'https://электрик-вологда.рф',
      'http://электрик-вологда.рф',
      'https://электрик-вологда.рф',
      'http://81.163.22.131/',
      'https://xn----8sbfefcvpbgg9abv3a6o.xn--p1ai/',
      'http://xn----8sbfefcvpbgg9abv3a6o.xn--p1ai/',
      'https://xn----8sbfefcvpbgg9abv3a6o.xn--p1ai',
      'http://xn----8sbfefcvpbgg9abv3a6o.xn--p1ai',
      'https://proelectro.netlify.app/',
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  }),
);

// get request to check if server is ready
app.get('/', (req, res) => res.send('server is ready'));

// Route to handle form submission
app.post('/submit', upload.single('file'), (req, res) => {
  const {
    website, name, email, phone, message,
  } = req.body;

  const attachments = [];
  if (req.file) {
    attachments.push({
      filename: req.file.originalname,
      content: req.file.buffer,
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: EMAIL,
    subject: `Сообщение с сайта ${website}`,
    text: `Имя: ${name}\nПочта: ${email}\nТелефон: ${phone}\nСообщение:\n${message}`,
    attachments,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while submitting.',
      });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ success: true, message: 'Submitted successfully!' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
