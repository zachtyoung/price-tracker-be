const puppeteer = require('puppeteer');

async function scrapeProduct(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url)
  const [el] = await page.$x('//*[@id="landingImage"]');
  const src = await el.getProperty('src');
  const Img = await src.jsonValue();

  const [el2] = await page.$x('//*[@id="title_feature_div"]')
  const txt = await el2.getProperty('textContent');
  const rawTxt = await txt.jsonValue();
  const filterdTxt = rawTxt.split(/[\n,\t]/).join("");
  const Description = filterdTxt.trim();

  const [el3] = await page.$x('//*[@id="priceblock_ourprice"]')
  const txt2 = await el3.getProperty('textContent');
  const Price = await txt2.jsonValue();
  browser.close()
  return {Img,Description,Price}
}
  module.exports = {
    scrapeProduct
  }