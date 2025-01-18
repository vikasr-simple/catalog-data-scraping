const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: false });

  console.log('Opening new page...');
  const page = await browser.newPage();
  console.log('Navigating to main URL...');
  await page.goto('https://app.barn2door.com/scarboroughfarms.shop/all?sellerSubCategories=96749,98522,98523,98524,96750', {
    waitUntil: 'networkidle2',
    timeout: 120000
  });

  console.log('Scrolling to load all products...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  console.log('Waiting for additional content to load...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('Extracting all product links...');
  const productLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.offer-tile a.offer-image'));
    return links.map(link => link.href);
  });

  console.log(`Found ${productLinks.length} product links.`);
  const offerDetails = [];

  // Loop through each product link and extract data
  for (const link of productLinks) {
    let retries = 3;
    while (retries > 0) {
      try {
        console.log(`Opening product page: ${link}`);
        const productPage = await browser.newPage();
        await productPage.goto(link, {
          waitUntil: 'networkidle2',
          timeout: 120000
        });

        console.log('Waiting for product details to load...');
        await productPage.waitForSelector('.title h1', { timeout: 30000 }); // Wait for the product title to ensure page is loaded

        console.log('Extracting product data...');
        const data = await productPage.evaluate(() => {
          const name = document.querySelector('.title h1')?.innerText || 'N/A';
          const size = document.querySelector('.price .size')?.innerText || 'N/A';
          const priceElement = document.querySelector('.price [itemprop="price"]');
          const priceSup = document.querySelector('.price sup');
          const price = priceElement ? (priceElement.innerText + (priceSup ? priceSup.innerText : '')) : 'N/A';
          const img = document.querySelector('.lazyload-wrapper img')?.src || 'N/A';
          const description = document.querySelector('.offer-description p')?.innerText || 'N/A';

          return { name, size, price, img, description, url: window.location.href };
        });

        if (data.name && data.price) {
          console.log(`Product data extracted: ${JSON.stringify(data)}`);
          offerDetails.push(data);
        } else {
          console.log(`Incomplete product data: ${JSON.stringify(data)}`);
        }

        console.log('Closing product page...');
        await productPage.close();
        break;
      } catch (error) {
        console.error(`Error extracting data from ${link}: ${error.message}`);
        retries--;
        if (retries === 0) {
          console.error(`Failed to extract data from ${link} after multiple attempts.`);
        } else {
          console.log(`Retrying... (${3 - retries} attempts left)`);
        }
      }
    }
  }

  console.log('Saving data to JSON file...');
  fs.writeFileSync('meracdise.json', JSON.stringify(offerDetails, null, 2));

  console.log('Data saved to beef.json');

  console.log('Closing browser...');
  await browser.close();
  console.log('Browser closed.');
})();
