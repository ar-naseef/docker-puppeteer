const puppeteer = require('puppeteer');

const chromeHeadless = false;

const verScraper = async (params) => {

  const browser1 = await puppeteer.launch({
    headless: chromeHeadless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser1.newPage();
  await page.goto('https://search.dca.ca.gov/advanced', { waitUntil: 'networkidle2' });

  console.log("selecting boardCode - BOARDS AND BUREAUS");
  await page.select('select#boardCode', "10"); // Veterinary Medical Board

  await page.select('select#licenseType', params.licence_type || '268'); // Veterinarian

  await page.select('select#primaryStatusCodes', '1');

  console.log("enter licence number");
  await page.type('input#licenseNumber', params.licence_number, {
    delay: 100
  })

  console.log("click submit and wait for results page to load");

  await Promise.all([
    page.click('input#srchSubmitHome'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  try {
    const elem = await page.$eval('a#mD0', el => el);
    console.log("click on nore details of the first results")
    // await page.click('a#mD0');

    const moreDetailsLink = await page.evaluate(() => {
      return document.querySelector('#mD0').href
    })

    console.log("loading - " + moreDetailsLink);
    await page.goto(moreDetailsLink, { waitUntil: 'networkidle2' });

    const resultsData = await page.evaluate(() => {
      return {
        licence_number: parseInt(document.querySelector('#licDetail').innerText.substr(22)),
        name: document.querySelector('p#name').innerText.substr(5).trim(),
        type: document.querySelector('p#licType').innerText.substr(13).trim(),
        status: document.querySelector('p#primaryStatus').innerText.substr(15).trim(),
        address: document.querySelectorAll('div#address > p')[1].innerText,

        issuance_date: document.querySelector('p#issueDate').innerText,
        expiration_date: document.querySelector('p#expDate').innerText,
      }
    });

    console.log("data", resultsData)

    console.log("closing browser1");
    await browser1.close();

    console.log("hello from vet scraper")
    return {
      status: 'success',
      data: resultsData
    }

  } catch (e) {
    console.log(e);
    console.log("no results found")
    // await browser1.close();
    return {
      status: 'error',
      error: "No licence found",
      data: {}
    }
  }
}

const therapyScraper = async (params) => {
  const browser = await puppeteer.launch({
    headless: chromeHeadless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto('https://search.dca.ca.gov/advanced', { waitUntil: 'networkidle2' });

  console.log("selecting boardCode - BOARDS AND BUREAUS");
  await page.select('select#boardCode', "3"); // Behavioral Sciences, Board of

  await page.select('select#licenseType', params.licence_type || '218'); // licenced Social worker

  await page.select('select#primaryStatusCodes', '1');

  console.log("enter licence number");
  await page.type('input#licenseNumber', params.licence_number, {
    delay: 100
  })

  console.log("click submit and wait for results page to load");

  await Promise.all([
    page.click('input#srchSubmitHome'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])

  try {
    const elem = await page.$eval('a#mD0', el => el);
    console.log("click on nore details of the first results")
    // await page.click('a#mD0');

    const moreDetailsLink = await page.evaluate(() => {
      return document.querySelector('#mD0').href
    })

    console.log("loading - " + moreDetailsLink);
    await page.goto(moreDetailsLink, { waitUntil: 'networkidle2' });

    const resultsData = await page.evaluate(() => {
      return {
        licence_number: parseInt(document.querySelector('#licDetail').innerText.substr(22)),
        name: document.querySelector('p#name').innerText.substr(5).trim(),
        type: document.querySelector('p#licType').innerText.substr(13).trim(),
        status: document.querySelector('p#primaryStatus').innerText.substr(15).trim(),
        address: document.querySelectorAll('div#address > p')[1].innerText,

        issuance_date: document.querySelector('p#issueDate').innerText,
        expiration_date: document.querySelector('p#expDate').innerText,
      }
    });

    console.log("data", resultsData)

    console.log("closing browser");
    await browser.close();

    console.log("hello from therapy scraper")
    return {
      status: 'success',
      data: resultsData
    }

  } catch (e) {
    console.log(e);
    console.log("no results found")
    // await browser.close();
    return {
      status: 'error',
      error: "No licence found",
      data: {}
    }
  }
}

module.exports = {
  vet: verScraper,
  therpay: therapyScraper
}