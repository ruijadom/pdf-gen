const express = require("express");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");
const app = express();

const items = [
  {
    name: "item 1"
  },
  {
    name: "item 2"
  },
  {
    name: "item 3"
  },
];

app.get("/pdf", async (request, response) => {
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

  response.contentType("application/pdf");

  return response.send(pdf);
});

app.get("/", (request, response) => {
  const filePath = path.join(__dirname, "print.ejs");
  ejs.renderFile(filePath, { items }, (err, html) => {
    if (err) {
      return response.send("Error reading the file");
    }

    // send to browser
    return response.send(html);
  });
});

app.listen(3000);
