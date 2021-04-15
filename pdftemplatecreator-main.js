const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");


const template = fs.readFileSync("./template/template.html", "utf-8");
const options = {
    html: template,
    data: {
        message: "confirmation",
    },
    path: "./confirmation.pdf",

};

createPDF(document, options).then((res) => {
    console.log(res);
    createPDF();
})
    .catch((err) => {
        console.log(err);
    });

async function createPDF(data = []) {
    var templateHtml = fs.readFileSync(path.join(`./template/`, 'template.html'), 'utf8');
    var template = handlebars.compile(templateHtml);
    var html = template(data);

    var pdfpath = `./confirmation.pdf`;

    var options = {
        width: '595px',
        //headerTemplate: "<p></p>",
        //footerTemplate: "<p></p>",
        //	displayHeaderFooter: false,
        format: "A4",
        orientantion: "portrait",
        border: "15mm",
        margin: {
            top: "10px",
            bottom: "30px"
        },
        printBackground: true,
        path: pdfPath
    }
    const response = await page.goto(`data:text/html;charset=UTF-8,<h1>Template</h1>`, {
        waitUntil: 'domcontentloaded'
    });
    await page.setContent(
        `${html}`
    )
    console.log(response.status())
    await page.pdf(options);
}
