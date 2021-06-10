const router = require('express').Router();

const fs = require("fs");
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

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
			executablePath: '/usr/local/lib/node_modules/puppeteer/.local-chromium/linux-884/chrome.exe',
			args: ['--no-sandbox', "--disabled-setupid-sandbox"],
			
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
		await page.close();
		await browser.close();

		let r = response['_status'];
		if(response['_status'] !== 200){
			return res.send({err: 'Error loading file'}).status(400);
		}

		let contents = fs.readFileSync(path.join(__dirname, '/notifications.pdf'), 'utf8');
		
		// var file = fs.createReadStream(path.join(__dirname, '/notifications.pdf'));
		var stat = fs.statSync(path.join(__dirname, '/notifications.pdf'));
		res.setHeader('Content-Length', stat.size);
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'attachment; filename=createdPDF.pdf');

		return res.send(contents).status(200);

	}catch(error) {
		return res.send({err: `Error linking fill / puppeteer: ${error}`}).status(400);
	}

    

} 

router.post('/notification', function(req, res) {
    createPDF(req, res, 'notificationOfTradeTestDate.html' );
})
router.post('/appointSME', function(req, res) {
    createPDF(req, res, 'appointSME.html' );
})
router.post('/feedback', function(req, res) {
    createPDF(req, res, 'feedback.html' );
})
router.post('/QTCO', function(req, res) {
    createPDF(req, res, 'QTCO.html' );
})
router.post('/Tsteyl', function(req, res) {
    createPDF(req, res, 'Tsteyl.html' );
})

router.get('/1', function(req, res) {
    createPDF(req, res, 'notificationOfTradeTestDate.html' );
})

router.post('/1', function(req, res) {
    createPDF(req, res, 'notificationOfTradeTestDate.html' );
})
router.post('/2', function(req, res) {
    createPDF(req, res, 'appointSME.html' );
})
router.post('/3', function(req, res) {
    createPDF(req, res, 'feedback.html' );
})
router.post('/4', function(req, res) {
    createPDF(req, res, 'QTCO.html' );
})
router.post('/5', function(req, res) {
    createPDF(req, res, 'Tsteyl.html' );
})

router.post('/6', function(req, res) {
    createPDF(req, res, 'AsswesorV2Letter.html' );
})
router.post('/7', function(req, res) {
    createPDF(req, res, 'legacyTrade.html' );
})
router.post('/8', function(req, res) {
    createPDF(req, res, 'TechnicalAA.html' );
})



module.exports = router;