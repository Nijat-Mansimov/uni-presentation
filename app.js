const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require("ejs");
const IP = require('ip');
const axios = require('axios');
const DeviceDetector = require('device-detector-js');

const URL = "https://ipgeolocation.abstractapi.com/v1/?api_key=f6ecf16cec1f4f188b5c2ccdad683f7e"
const sendAPIRequest = async (ipAddress) => {
    const apiResponse = await axios.get(URL + "&ip_address=" + ipAddress);
    return apiResponse.data;
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const detector = new DeviceDetector();
    const result = detector.parse(userAgent);

    if (result.device) {
        req.deviceName = result.device.model;
    } else {
        req.deviceName = 'Unknown Device';
    }

    next();
});

app.get("/", async (req, res) => {
  // Replace 'your-template' with the name of your EJS template file (without the '.ejs' extension)
  const ipAddress = IP.address();
  const ipAddressInformation = await sendAPIRequest(ipAddress);
  console.log({"IP": ipAddressInformation.ip_address, "Device": req.deviceName})
  res.render('home');
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});