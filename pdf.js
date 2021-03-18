const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

const template = fs.readFileSync("./template/template.html", "utf-8");
const options = {
    format: "A4", 
    orientantion: "portrait",
    border: "15mm",
};

const document = {
    html: template,
    data: {
        message: "referenceNum",
        image: `file://${__dirname}/template/codeOfArms.svg`
    },
    path: "./notifications.pdf",

};


createPDF();
// pdf.create(document, options).then((res)=>{
//     console.log(res);
//     createPDF();
// })
// .catch((err) => {
//     console.log(err);
// });


async function createPDF(data = []) {
    var templateHtml = fs.readFileSync(path.join(`${__dirname}/template/`, 'template.html'), 'utf8');
	var template = handlebars.compile(templateHtml);
    // let img = // get local path or generate base64 image
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

}