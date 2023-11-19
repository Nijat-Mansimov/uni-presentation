const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const os = require('os');
const axios = require('axios');

const URL = 'https://ipgeolocation.abstractapi.com/v1/?api_key=f6ecf16cec1f4f188b5c2ccdad683f7e';

const getPrivateIP = () => {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
        for (const addressInfo of interfaces[iface]) {
            if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                return addressInfo.address;
            }
        }
    }
    return 'Unknown Private IP';
};

const sendAPIRequest = async (ipAddress) => {
    try {
        const apiResponse = await axios.get(URL + '&ip_address=' + ipAddress);
        return apiResponse.data;
    } catch (error) {
        console.error('Error in API request:', error.message);
        return {}; // Provide a default response or handle the error as needed
    }
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const publicIPAddress = await axios.get('https://api64.ipify.org?format=json')
            .then(response => response.data.ip);
        const privateIPAddress = getPrivateIP();
        const ipAddressInformation = await sendAPIRequest(publicIPAddress);

        console.log({ PublicIP: publicIPAddress, PrivateIP: privateIPAddress, Device: os.hostname() });
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
