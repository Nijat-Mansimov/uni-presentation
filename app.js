const express = require('express');
const path = require('path');
const platform = require("platform");
const UAParser = require('ua-parser-js'); // Import ua-parser-js

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const userAgent = req.headers['user-agent'];
        let parser = new UAParser(userAgent);
        let parserResults = parser.getDevice();
        console.log({"IP addresses": req.header('x-forwarded-for'), "Device": parserResults})
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
