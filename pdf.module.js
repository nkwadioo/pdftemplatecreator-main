const router = require('express').Router();

const fs = require("fs");
const path = require('path');
const puppeteer = require('puppeteer');
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
        }catch (error) {
            console.log(error)
        }
    })();
}else {
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

let formData = {logo: '<img src="#" alt="Department of Education logo">'}
try {
	let dir = path.join(`${__dirname}/template/`, "codeOfArms.svg");
	const buffer = fs.readFileSync(dir, 'utf-8');
	// use the toString() method to convert
	// Buffer into String
	formData.logo = buffer.toString();
}catch(e) {
	console.log('could not load logo: >>> ' + e);
}

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
			// executablePath: '/usr/local/lib/node_modules/puppeteer/.local-chromium/linux-884/chrome.exe',
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

function createPDF2( req, res, template_name) {
	let filePath = path.join(__dirname, './template/', `${template_name}`);
	ejs.renderFile(filePath, {student: {enquires: 'testing'}}, (err, data) => { // 
		if (err) {
          res.send(err);
    	} else {
			let options = {
            "height": "11.25in",
            "width": "8.5in",
            "header": {
                "height": "20mm"
            },
            "footer": {
                "height": "20mm",
            },
        };
        pdf.create(data, options).toFile("report.pdf", function (err, data) {
            if (err) {
                res.send(err);
            } else {
				let contents = fs.readFileSync(path.join(__dirname, '/report.pdf'), 'utf8');
		
				// var file = fs.createReadStream(path.join(__dirname, '/notifications.pdf'));
				var stat = fs.statSync(path.join(__dirname, '/report.pdf'));
				res.setHeader('Content-Length', stat.size);
				res.setHeader('Content-Type', 'application/pdf');
				res.setHeader('Content-Disposition', 'attachment; filename=createdPDF2.pdf');

				return res.send(contents).status(200);
                console.log("File created successfully");
            }
        });
		}
	})
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
    createPDF2(req, res, 'test.ejs' );
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