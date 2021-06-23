const router = require('express').Router();
const generatepdfNotification = {};

const fs = require("fs");
const path = require('path');
const handlebars = require("handlebars");

let puppeteer;
let revisionInfo;
console.log('INIT puppeteer')
if (process.env.PORT) {
	(async () => {

		try {
			puppeteer = require('puppeteer-core');
			// console.log('TRYING TO FETCH BROWSER')
			const browserFetcher = puppeteer.createBrowserFetcher();
			revisionInfo = await browserFetcher.download('884014');
			// console.log('BROWSER fetched successfully');
		} catch (error) {
			console.log(error)
		}
	})();
} else {
	puppeteer = require('puppeteer');
}

/*
https://openbase.com/js/puppeteer-core/versions

Chromium 92.0.4512.0 - Puppeteer v10.0.0 --- r 884014
Chromium 91.0.4469.0 - Puppeteer v9.0.0
Chromium 90.0.4427.0 - Puppeteer v8.0.0
Chromium 90.0.4403.0 - Puppeteer v7.0.0
Chromium 89.0.4389.0 - Puppeteer v6.0.0
Chromium 88.0.4298.0 - Puppeteer v5.5.0
Chromium 87.0.4272.0 - Puppeteer v5.4.0
Chromium 86.0.4240.0 - Puppeteer v5.3.0
Chromium 85.0.4182.0 - Puppeteer v5.2.1
Chromium 84.0.4147.0 - Puppeteer v5.1.0
Chromium 83.0.4103.0 - Puppeteer v3.1.0
Chromium 81.0.4044.0 - Puppeteer v3.0.0
*/

let formData = { logo: '<img src="#" alt="Department of Education logo">' }
try {
	let dir = path.join(`${__dirname}/template/`, "codeOfArms.svg");
	const buffer = fs.readFileSync(dir, 'utf-8');
	// use the toString() method to convert
	// Buffer into String
	formData.logo = buffer.toString();
} catch (e) {
	console.log('could not load logo: >>> ' + e);
}

async function createPDF(req, res, teplate_name) {
	try {
		var templateHtml = fs.readFileSync(path.join(`${__dirname}/template/`, teplate_name), 'utf8');
		var template = handlebars.compile(templateHtml);
		// let img = // get local path or generate base64 image
		let data = { ...formData, ...req.body };
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

		let browser;

		console.log('LOADING ... browser');
		if (!process.env.PORT) {
			browser = await puppeteer.launch();
			console.log('With sandbox')

		} else {
			browser = await puppeteer.launch(
				{
					executablePath: revisionInfo.executablePath,
					args: ['--no-sandbox', "--disabled-setupid-sandbox"],
				}
			)
			console.log('With OUT sandbox')
		}

		console.log('browser created')
		var page = await browser.newPage();

		const response = await page.goto(`data:text/html;charset=UTF-8,<h1>Template</h1>`, {
			// waitUntil: 'domcontentloaded'
		});

		await page.setContent(
			`${html}`
		)


		let pdfFile = await page.pdf(options);
		//pdfFile = pdfFile.toString()
		await page.close();
		await browser.close();
		console.log(response.status(), 'PDF Generated')

		let r = response['_status'];
		if (response['_status'] !== 200) {
			return res.send({ err: 'Error loading file' }).status(400);
		}


		let document = fs.readFileSync(path.join(__dirname, '/notifications.pdf')).toString('base64');
		// let document = fs.createReadStream((path.join(__dirname, '/invoice.pdf')));
		// var stat = fs.statSync(path.join(__dirname, '/notifications.pdf'));
		// res.setHeader('Content-Length', stat.size);
		// response.setHeader('Content-Type', 'application/pdf');
		// response.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
		// document.pipe(response);
		return res.send({ isfile: `data:application/pdf;base64,${document}` }).status(200)

	} catch (error) {
		return res.send({ err: `Error linking fill / puppeteer: ${error}` }).status(400);
	}

}

router.post('/notification', function (req, res) {
	createPDF(req, res, 'notificationOfTradeTestDate.html');
})
router.post('/appointSME', function (req, res) {
	createPDF(req, res, 'appointSME.html');
})
router.post('/feedback', function (req, res) {
	createPDF(req, res, 'feedback.html');
})
router.post('/QTCO', function (req, res) {
	createPDF(req, res, 'QTCO.html');
})
router.post('/Tsteyl', function (req, res) {
	createPDF(req, res, 'Tsteyl.html');
})

router.get('/1', function (req, res) {
	createPDF(req, res, 'notificationOfTradeTestDate.html');
})

router.post('/generatepdfNotification', function (req, res) {
	createPDF(req, res, 'notificationOfTradeTestDate.html');
})
router.post('/AppointSME', function (req, res) {
	createPDF(req, res, 'appointSME.html');
})
router.post('/AppealReport', function (req, res) {
	createPDF(req, res, 'feedback.html');
})
router.post('/Approval', function (req, res) {
	createPDF(req, res, 'QTCO.html');
})
router.post('/Auditing', function (req, res) {
	createPDF(req, res, 'Tsteyl.html');
})
router.post('/Registration', function (req, res) {
	createPDF(req, res, 'AsswesorV2Letter.html');
})
router.post('/7', function (req, res) {
	createPDF(req, res, 'legacyTrade.html');
})
router.post('/Accreditation', function (req, res) {
	createPDF(req, res, 'TechnicalAA.html');
})


{
	const generatepdfNotification = {
		ref_no: Number,
		trade_test_centre: String,
		trade: String,
		ofocode: Number,
		speciliasation: String,
		trade_test_date: Date,
		time: Number,
		workshop_no: Number,
		requirements: String,

	},
		AppointSME = {
			investigator: String,
			trade: String,
			appeal_investigator: String,
			date: Date,
			trade_test_centre_name: String,
			physical_address: String,
			contact_person: String,
			contact_no: Number,
			email: String
		},

		Registration = {
			reg_dateF: Date,
			reg_dateT: Date,
			reg_dateA: Date,
			reg_dateM: Date,
			trade_title: String,
			speciliasation: String,

		},

		Auditing = {
			accreditation_audit: String,
			trade: String,
		},


		AppealReport = {
			candidate: String,
			trade_test_centre_name: String,
			complaint: String,
			date: Date,
			investigation: String,
			agreement: String,
			feedback: String,
			additional_info: String,
			conclusion: String,
			background: String,
		},

		Approval = {
			trade_test_centre_name : String,
			centre_num : Number,
			physical_address : String,
			OFOCode : Number,
			specialisation : String,
			trade_title : String,
			start_date : Date,
			end_date : Date,
		},

		Accreditation = {
			trade_test_centre_name : String,
			physical_address : String,
			contact_person : String,
			contact_details : Number,
			email : String,
		}
		}


module.exports = router;
