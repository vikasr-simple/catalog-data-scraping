const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const MAX_RETRIES = 3; // Maximum retries for fetching product details
  const FILE_NAME = 'CupsData.json'; // File to save scraped data

  // Load existing data to avoid duplicates
  let existingProducts = [];
  if (fs.existsSync(FILE_NAME)) {
    const fileContents = fs.readFileSync(FILE_NAME, 'utf8');
    if (fileContents) {
      existingProducts = JSON.parse(fileContents);
    }
  }
  const processedUrls = new Set(existingProducts.map((prod) => prod.productUrl));

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: false, // Run in visible mode for debugging
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  let totalProductsScraped = 0;

  try {
    let currentPageUrl = 'https://greenpaperproducts.com/collections/cups';

    while (currentPageUrl) {
      console.log(`Navigating to: ${currentPageUrl}`);
      await page.goto(currentPageUrl, { waitUntil: 'networkidle2' });

      // Wait for product cards to load
      await page.waitForSelector('div.product-card', { timeout: 60000 });

      // Extract product data and navigate to each product
      const productUrls = await page.evaluate(() => {
        const products = document.querySelectorAll('div.product-card');
        return Array.from(products).map((product) => {
          const button = product.querySelector('div.c-iconWithText -icon-right a');
          return button ? button.href : null;
        }).filter(Boolean); // Filter out null or undefined URLs
      });

      console.log(`Found ${productUrls.length} products on the page.`);

      // Process each product
      for (let productUrl of productUrls) {
        if (processedUrls.has(productUrl)) {
          console.log(`Duplicate product detected: ${productUrl}. Skipping.`);
          continue;
        }

        let retries = 0;
        let success = false;

        while (retries < MAX_RETRIES && !success) {
          try {
            console.log(`Navigating to product page: ${productUrl}`);
            await page.goto(productUrl, { waitUntil: 'networkidle2' });

            // Wait for the product details to load
            await page.waitForSelector('div.product-single__description', { timeout: 30000 });

            // Extract product details
            const productData = await page.evaluate(() => {
              const name = document.querySelector('h1.product-single__title')?.innerText.trim() || 'N/A';
              const price = document.querySelector('span.product-single__price')?.innerText.trim() || 'N/A';
              const description = document.querySelector('div.product-single__description')?.innerText.trim() || 'N/A';
              const specsTable = document.querySelectorAll('table.product-single__table tr');
              const specifications = {};
              specsTable.forEach((row) => {
                const key = row.querySelector('th')?.innerText.trim() || 'N/A';
                const value = row.querySelector('td')?.innerText.trim() || 'N/A';
                specifications[key] = value;
              });
              const imageUrl = document.querySelector('img.product-single__photo')?.src || 'N/A';

              return { name, price, description, specifications, imageUrl, productUrl: window.location.href };
            });

            existingProducts.push(productData);
            processedUrls.add(productUrl);
            totalProductsScraped++;
            console.log(`Scraped data for: ${productData.name}`);
            success = true;
          } catch (error) {
            console.error(`Error fetching details for product at ${productUrl}: ${error.message}`);
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before retrying
          }
        }

        if (!success) {
          console.log(`Failed to fetch details for product at ${productUrl} after ${MAX_RETRIES} attempts.`);
        }
      }

      // Save data to file after processing each page
      fs.writeFileSync(FILE_NAME, JSON.stringify(existingProducts, null, 2), 'utf8');
      console.log(`Saved page data to file: ${FILE_NAME}`);

      // Check for next page
      const nextPage = await page.evaluate(() => {
        const nextButton = document.querySelector('a.pagination__next');
        return nextButton ? nextButton.href : null;
      });
      currentPageUrl = nextPage;
    }
  } catch (err) {
    console.error(`Error during scraping: ${err.message}`);
  } finally {
    console.log(`Scraping complete. Total products scraped: ${totalProductsScraped}`);
    await browser.close();
  }
})();
