const puppeteer = require('puppeteer');
const fs = require('fs');

// Delay function as an alternative to `page.waitForTimeout()`
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseUrl = 'https://shop.kingarthurbaking.com/pans/bundt-specialty';
  const fileName = "bundt-specialty.json";

  // Set to track product URLs that have been processed
  const processedUrls = new Set();

  // Check if the file exists, and if so, load the existing URLs from it
  if (fs.existsSync('productDetails.json')) {
    const existingData = fs.readFileSync('productDetails.json', 'utf-8');
    const existingProducts = existingData
      .split(',\n')
      .filter(Boolean)
      .map((entry) => JSON.parse(entry));

    existingProducts.forEach((product) => {
      processedUrls.add(product.contentUrl); // Track already processed product URLs
    });
  }

  // Navigate to the main product page
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 0 });

  // Scroll and extract products multiple times to ensure all products are loaded
  let previousHeight;
  try {
    while (true) {
      previousHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(3000); // Wait for 3 seconds to allow new products to load
      const newHeight = await page.evaluate(() => document.body.scrollHeight);
      if (newHeight === previousHeight) {
        break; // No more new content is being loaded
      }
    }
  } catch (error) {
    console.error('Error scrolling the page:', error);
  }

  // Extract all product URLs from the page
  const productUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/items/"]')).map(
      (a) => a.href
    );
  });

  console.log(`Found ${productUrls.length} product URLs`);
  console.log(productUrls);

  // Loop through each product URL and extract details
  for (let productUrl of productUrls) {
    // Skip if the product URL has already been processed
    if (processedUrls.has(productUrl)) {
      console.log(`Skipping already processed product: ${productUrl}`);
      continue;
    }

    try {
      await retryGoto(page, productUrl);
      console.log(`Visiting: ${productUrl}`);

      // Use fallback selector method
      const found = await waitForSelectorWithFallback(page, 'div.productView', 3);
      if (!found) {
        console.error(`Failed to find productView-title on ${productUrl}`);
        const html = await page.content();
        fs.writeFileSync(`failedPage_${new Date().getTime()}.html`, html); // Save HTML for inspection
        continue; // Skip this product
      }

      // Extract product details
      const productData = await page.evaluate(() => {
        const title = document.querySelector('h1.productView-title')?.innerText.trim() || 'N/A';
        const price = document.querySelector('span.orig-price')?.innerText.trim() || 'N/A';
        const sku = document.querySelector('div.product-sku')?.innerText.trim() || 'N/A';
        const description = document.querySelector('div.tab-content-left p')?.innerText.trim() || 'N/A';
        const imageUrl = document.querySelector('div.productView-img-container img')?.src || 'N/A';
        const contentUrl = window.location.href;

        return {
          title,
          price,
          sku,
          description,
          imageUrl,
          contentUrl,
        };
      });

      // Save the product details to the JSON file immediately after extracting it
      fs.appendFileSync(
        fileName,
        JSON.stringify(productData, null, 2) + ',\n'
      );
      console.log(`Saved data for product: ${productData.title}`);
      
      // Mark the product URL as processed
      processedUrls.add(productUrl);

    } catch (error) {
      console.error(`Error scraping ${productUrl}:`, error);
      await page.screenshot({ path: `error_${new Date().getTime()}.png` }); // Capture screenshot for debugging
    }
  }

  console.log('Scraping completed, data saved to productDetails.json');
  await browser.close();
})();

// Retry function
async function retryGoto(page, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      return; // Exit if successful
    } catch (error) {
      console.error(`Retrying ${url} (${i + 1}/${retries}) due to error:`, error);
    }
  }
  throw new Error(`Failed to load ${url} after ${retries} retries.`);
}

// Wait for selector with fallback logic
async function waitForSelectorWithFallback(page, selector, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
      return true; // Success, return
    } catch (error) {
      console.error(`Retrying selector '${selector}' (${i + 1}/${retries}) due to error:`, error);
      await delay(3000); // Wait for 3 seconds before retrying
    }
  }
  return false; // Failed after retries
}
