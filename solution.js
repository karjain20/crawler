const LANDING_PAGE_URL = 'https://www.cnbc.com/us-market-movers/';
const FORM_URL = 'https://tinyurl.com/mtpzcucb';
const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  

  // Visit the landing page url and wait until it loads
  await page.goto(LANDING_PAGE_URL,
    {waitUntil: "load"}
    ).catch((err) => console.log("error loading url", err));

  // find the nasdaq button via the XPath
  const NASDAQButton = await page.$x('//*[@id="MainContentContainer"]/div/div/div/div[3]/div[1]/section/section[1]/div/button[2]')

  await NASDAQButton[0].click()

  await page.waitForSelector('table')

  // following function gets the second row form the Top Movers Table
  const secondrow = await page.evaluate(() => {
    elements = document.getElementsByClassName('MarketTop-topTable')[0];
    name = elements.rows[1].cells[0].textContent;
    full_name = elements.rows[1].cells[1].textContent;
    value = elements.rows[1].cells[2].textContent;
    pct_change = elements.rows[1].cells[3].textContent;
    return {name, full_name, value, pct_change};
  });

  // (TOD0) assert data integrity

  // Open the form page
  const form_page = await browser.newPage();
  
  // wait for the form to load
  await form_page.goto(FORM_URL,
    {waitUntil: "load"}
    ).catch((err) => console.log("error loading url", err));

  // input required data
  await form_page.type('#SingleLine-li > div.tempContDiv > span > input[type=text]', secondrow['name']);
  await form_page.type('#SingleLine2-li > div.tempContDiv > span > input[type=text]', Date.now().toString());
  await form_page.type('#SingleLine1-li > div.tempContDiv > span > input[type=text]', secondrow['pct_change']);

  // submit the form
  await form_page.$eval("#formAccess > div.pageFotDef > div > div > button", elem => elem.click());

  
  browser.close();
}

run();


