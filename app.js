const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: process.env.SMPT_TO_MAIL,
            subject: "IP address",
            text: req.header('x-forwarded-for'),
        };

        await transporter.sendMail(mailOptions);

        res.render('home');
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).send('Internal Server Error'); // Send a 500 status in case of an error
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
