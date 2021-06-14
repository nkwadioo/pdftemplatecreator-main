const express = require('express');
const app = express();

// const pdf = require("pdf-creator-node");
const cors = require("cors");

app.use(cors());
app.use(express.json());

//Import Routes
const pdfRoute = require('./pdf.module');
app.use('/generatePdf', pdfRoute);


// 3109
app.use('/', (req, res) => res.send("Welcome To Pdf generator !"));
app.listen((process.env.PORT || 3109) /* '10.123.56.203', */, () => console.log(' Server is ready on :' + (process.env.PORT || 3109)));