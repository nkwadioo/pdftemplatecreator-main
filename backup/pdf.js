const express = require('express');
const app = express();

// const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

app.use(express.json());

app.get('/generatePdf/1', function(req, res) {
    createPDF(req, res );
})

async function createPDF( req, res) {
    var templateHtml = fs.readFileSync(path.join(`${__dirname}/template/`, 'template.html'), 'utf8');
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
	await browser.close();

    return res.send(response.status())

}
app.use('/', (req, res) => res.send("Welcome Pdf generator !"));
app.listen(4500, () => console.log(' Server is ready on localhost:' + 4500));