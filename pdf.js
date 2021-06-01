const express = require('express');
const app = express();

// const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

app.use(express.json());

app.get('/generatePdf/notification', function(req, res) {
    createPDF(req, res, 'notificationOfTradeTestDate.html' );
})
app.get('/generatePdf/appointSME', function(req, res) {
    createPDF(req, res, 'appointSME.html' );
})
app.get('/generatePdf/feedback', function(req, res) {
    createPDF(req, res, 'feedback.html' );
})
app.get('/generatePdf/QTCO', function(req, res) {
    createPDF(req, res, 'QTCO.html' );
})
app.get('/generatePdf/Tsteyl', function(req, res) {
    createPDF(req, res, 'Tsteyl.html' );
})

app.get('/generatePdf/1', function(req, res) {
    createPDF(req, res, 'notificationOfTradeTestDate.html' );
})
app.get('/generatePdf/2', function(req, res) {
    createPDF(req, res, 'appointSME.html' );
})
app.get('/generatePdf/3', function(req, res) {
    createPDF(req, res, 'feedback.html' );
})
app.get('/generatePdf/4', function(req, res) {
    createPDF(req, res, 'QTCO.html' );
})
app.get('/generatePdf/5', function(req, res) {
    createPDF(req, res, 'Tsteyl.html' );
})

async function createPDF( req, res, teplate_name) {
    try {
		var templateHtml = fs.readFileSync(path.join(`${__dirname}/template/`, teplate_name), 'utf8');
		var template = handlebars.compile(templateHtml);
		// let img = // get local path or generate base64 image
		let data = req.body;
		var html = template(data);

		var milis = new Date();
		milis = milis.getTime();

		var pdfPath = `./notifications.pdf`;

		var options = {
			width: '595px',
			headerTemplate: "<p></p>",
			footerTemplate: "<p></p>",
			displayHeaderFooter: false,
			margin: {
				top: "10px",
				bottom: "30px"
			},
			printBackground: true,
			path: pdfPath
		}

		// puppeteer.cl try closing or creating new puppeteer

		const browser = await puppeteer.launch({
			args: ['--no-sandbox'],
			headless: true
		});

		var page = await browser.newPage();
		
		const response = await page.goto(`data:text/html;charset=UTF-8,<h1>Template</h1>`, {
			waitUntil: 'domcontentloaded'
		});

		await page.setContent(
			`${html}`
		)

		console.log(response.status())


		
			await page.pdf(options);
			// await page.close();
			await browser.close();

			let r = response['_status'];
			if(response['_status'] !== 200){
				return res.send({err: 'Error loading file'}).status(400);
			}
			var file = fs.createReadStream(path.join(__dirname, '/notifications.pdf'));
			var stat = fs.statSync(path.join(__dirname, '/notifications.pdf'));
			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'attachment; filename=createdPDF.pdf');
			file.pipe(res)

			var readStream = fs.createReadStream(path.join(__dirname, '/notifications.pdf'));
			readStream
			.on('data', function (chunk) {
				console.log(chunk);
				// chunk.pipe(res)
				// readStream.destroy();
				// res.send(chunk)

				// return res.status(200).send(chunk);
			})
			.on('end', function () {
				// This may not been called since we are destroying the stream
				// the first time 'data' event is received
				console.log('All the data in the file has been read');
			})
			.on('error', function(err) {
				
				return res.status(400).send('err');
			})
			.on('close', function (err) {
				readStream.destroy()
				console.log('Stream has been destroyed and file has been closed');
				return res.status(200).send('done');
			});

	}catch(err) {
		return res.send({err: 'Error linking fill / puppeteer'}).status(400);
	}

	

	// var stream;
	// stream = fs.createReadStream(path.join(__dirname, '/notifications.pdf'), {autoClose: true});

	// stream.on("data", function(data) {
	// 	var chunk = data.toString();
	// 	// console.log(chunk);

	// 	return res.send(data).status(200);
	// })

	// stream.on('open', function () {
	// 	// This just pipes the read stream to the response object (which goes to the client)
	// 	stream.pipe(res);
	// });

	// This catches any errors that happen while creating the readable stream (usually invalid names)
	// stream.on('error', function(err) {
	// 	return res.send(err).status(400);
	// });
    

}
app.use('/', (req, res) => res.send("Welcome Pdf generator !"));
app.listen(3109 /* '10.123.56.203', */, () => console.log(' Server is ready on -' + 3109));