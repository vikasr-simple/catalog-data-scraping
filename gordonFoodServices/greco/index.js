const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch the browser and create a new page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Increase the default navigation timeout
  page.setDefaultNavigationTimeout(60000);

  // Navigate to the initial URL start add 4507
  await page.goto('https://net3.necs.com/concordfoods/site/catalog/allitems?offset=4507&limit=250&col=item_no&dir=ASC&terms=&queryCol=', { waitUntil: 'networkidle2' });

  let productUrls = [];
  let hasNextPage = true;
  let currentPage = 19;

  // Collect product URLs
  while (hasNextPage) {
    try {
      console.log(`Collecting product URLs from page ${currentPage}`);
      await page.waitForSelector('.item-block .item', { timeout: 30000 });

      const newProductUrls = await page.evaluate(() => {
        const items = document.querySelectorAll('.item-block .item .product-name a');
        return Array.from(items).map(item => item.href);
      });

      productUrls = productUrls.concat(newProductUrls);

      const nextButton = await page.$('button.link-view[onclick*="offset="]:last-of-type');
      if (nextButton && currentPage < 19) {
        await nextButton.evaluate(button => button.scrollIntoView());
        await new Promise(resolve => setTimeout(resolve, 1000));
        await nextButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        currentPage++;
      } else {
        hasNextPage = false;
      }
    } catch (error) {
      console.error(`Error on page ${currentPage}: ${error.message}`);
      hasNextPage = false;
    }
  }

  console.log(`Total product URLs collected: ${productUrls.length}`);

  // Retry logic configuration
  const MAX_RETRIES = 3;

  // Extract product details and save them one by one
  for (let i = 0; i < productUrls.length; i++) {
    const url = productUrls[i];
    let retries = 0;
    let success = false;

    while (retries < MAX_RETRIES && !success) {
      try {
        console.log(`Extracting product details from ${i + 1}/${productUrls.length}: ${url} (Attempt ${retries + 1})`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        await page.waitForSelector('.product-shop', { timeout: 30000 });

        const productData = await page.evaluate(() => {
          const contentUrl = window.location.href;
          const name = document.querySelector('.product-name h1[itemprop="name"]')?.innerText.trim() || 'N/A';
          const brand = document.querySelector('.price-box .price')?.innerText.replace('Brand: ', '').trim() || 'N/A';
          const productImage = document.querySelector('.product-image .large-image img')?.src.trim() || 'N/A';
          const productClass = document.querySelector('.short-description')?.innerHTML.match(/<b>Class:<\/b>\s*([^<]*)/)?.[1]?.trim() || 'N/A';
          const unitMeasure = document.querySelector('.short-description')?.innerHTML.match(/<b>Unit Meas:<\/b>\s*([^<]*)/)?.[1]?.trim() || 'N/A';
          const packSize = document.querySelector('.short-description')?.innerHTML.match(/<b>Pack Size:<\/b>\s*([^<]*)/)?.[1]?.trim() || 'N/A';
          const weight = document.querySelector('.short-description')?.innerHTML.match(/<b>Weight:<\/b>\s*([^<]*)/)?.[1]?.trim() || 'N/A';
          const notes = document.querySelector('.short-description')?.innerHTML.match(/<b>Notes<\/b>\s*([^<]*)/)?.[1]?.trim() || 'N/A';

          return { contentUrl, name, brand, productImage, productClass, unitMeasure, packSize, weight, notes };
        });

        productData.productId = url.split('/').pop();

        if (productData.name !== 'N/A') {
          // Save product data to JSON file immediately after extraction
          fs.appendFile('products.json', JSON.stringify(productData, null, 2) + ',\n', 'utf8', (err) => {
            if (err) {
              console.error(`Error writing product data to products.json: ${err.message}`);
            } else {
              console.log(`Product data for ${productData.name} (ID: ${productData.productId}) successfully saved.`);
            }
          });
        }

        success = true;

      } catch (error) {
        console.error(`Error extracting product from ${url} (Attempt ${retries + 1}): ${error.message}`);
        retries++;
        if (retries >= MAX_RETRIES) {
          console.error(`Max retries reached for ${url}. Moving to next product.`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  await browser.close();
})();