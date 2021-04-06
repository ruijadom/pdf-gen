const express = require("express");
const ejs = require("ejs");
const path = require("path");
const app = express();
const puppeteer = require("puppeteer");


const port = 3000;

const items = [
  {
    name: "item 1",
  },
  {
    name: "item 2",
  },
  {
    name: "item 3",
  },
];

app.get("/pdf", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/", {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: "A4",
    landscape: false,
    margin: 1,
  });

  await browser.close();

  res.contentType("application/pdf");

  return res.send(pdf);
});

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "print.ejs");
  ejs.renderFile(filePath, { items }, (err, html) => {
    if (err) {
      return res.send("Error reading the file");
    }

    // send to browser
    return res.send(html);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
