const pdf = require("pdf-creator-node");
const fs = require("fs");

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
    },
    path: "./notifications.pdf",

};

pdf.create(document, options).then((res)=>{
    console.log(res);
})
.catch((err) => {
    console.log(err);
    let r = 0;
});