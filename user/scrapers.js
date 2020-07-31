const puppeteer = require('puppeteer');

async function scrapeProduct(url){
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url)
  const [el] = await page.$x('//*[@id="landingImage"]');
  const src = await el.getProperty('src');
  const img_url = await src.jsonValue();

  const [el2] = await page.$x('//*[@id="productTitle"]')
  const txt = await el2.getProperty('textContent');
  const rawTxt = await txt.jsonValue();
  const filterdTxt = rawTxt.split(/[\n,\t]/).join("");
  const description = filterdTxt.trim();

  const [el3] = await page.$x('//*[@id="priceblock_ourprice"]')
  const txt2 = await el3.getProperty('textContent');
  const price = await txt2.jsonValue();
  browser.close()
  return {img_url,description,price}
}
  module.exports = {
    scrapeProduct
  }