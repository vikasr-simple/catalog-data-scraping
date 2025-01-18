const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // https://ecatalog.wismettacusa.com/products.php?branch=9&category=104
  // https://ecatalog.wismettacusa.com/products.php?branch=9&category=10
  // ÷https://ecatalog.wismettacusa.com/products.php?branch=9&category=10
  // https://ecatalog.wismettacusa.com/products.php?branch=9&new_release=Y
  const baseUrl = 'https://ecatalog.wismettacusa.com/';
  const productPageUrl = `${baseUrl}products.php?branch=9&new_release=Y`;
  const allProducts = [];

  // Helper function to introduce a delay
  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // Step 1: Navigate to the last page of the product listing
  const navigateToLastPage = async () => {
    await page.goto(productPageUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    try {
      while (true) {
        // Wait for the pagination controls to load
        await page.waitForSelector('.pagination', { timeout: 10000 });

        // Check if there is a "Next" button that is not disabled
        const nextPageButtonExists = await page.$('.pagination .pg-next:not(.disabled)');
        if (!nextPageButtonExists) {
          console.log('Reached the last page.');
          break; // Stop if no "Next" button is available, meaning we are at the last page
        }

        // Click the "Next" button to go to the next page
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
          page.evaluate(() => {
            document.querySelector('.pagination .pg-next:not(.disabled)').click();
          }),
        ]);

        // Add a small delay to ensure the next page loads properly
        await delay(2000);
      }
    } catch (error) {
      console.error('Error during navigating to the last page:', error);
    }
  };

  // Step 2: Extract product details from each page, starting from the last page to the first
  const extractProductDetailsFromLastToFirstPage = async () => {
    let currentPage = 'last';

    while (true) {
      try {
        // Wait for the product items to load
        await page.waitForSelector('#product-item-list', { timeout: 10000 });

        // Extract product details from the current page
        const productsOnCurrentPage = await page.evaluate(() => {
          const products = [];
          document.querySelectorAll('.product-items').forEach((product) => {
            const name = product.querySelector('.product-list-name')?.innerText.trim() || '';
            const brand = product.querySelector('.product-list-brand')?.innerText.trim() || '';
            const category = product.querySelector('.product-list-category')?.innerText.trim() || '';
            const itemNumber = product.querySelector('.product-list-id')?.innerText.trim() || '';
            const packSize = product.querySelector('.product-list-packsize span')?.innerText.trim() || '';
            const minOrderQty = product.querySelector('.product-list-minimum-order span')?.innerText.trim() || '';
            const barcode = product.querySelector('.product-list-barcode span')?.innerText.trim() || '';
            const description = product.querySelector('.product-list-description')?.innerText.trim() || '';
            const mainImageUrl = product.querySelector('.product-thumbnails img')?.src || '';
            const link = product.querySelector('.product-url')?.href || '';

            products.push({
              name,
              brand,
              category,
              itemNumber,
              packSize,
              minOrderQty,
              barcode,
              description,
              mainImageUrl,
              link,
            });
          });
          return products;
        });

        console.log(`Page ${currentPage}: Found ${productsOnCurrentPage.length} products.`);

        // Add extracted products to the allProducts array
        allProducts.push(...productsOnCurrentPage);

        // Check if there is a "Previous" page button that is not disabled
        const prevPageButtonExists = await page.$('.pagination .pg-prev:not(.disabled)');
        if (!prevPageButtonExists) {
          console.log('Reached the first page.');
          break; // No more previous pages, we're at the first page
        }

        // Click the "Previous" button to go back to the previous page
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
          page.evaluate(() => {
            document.querySelector('.pagination .pg-prev:not(.disabled)').click();
          }),
        ]);

        // Add a small delay to ensure the previous page loads properly
        await delay(2000);

        // Update the current page for logging purposes
        if (typeof currentPage === 'string' && currentPage === 'last') {
          currentPage = 1;
        } else {
          currentPage += 1;
        }
      } catch (error) {
        console.error(`Error during pagination on page ${currentPage}:`, error);
        break;
      }
    }

    // Step 3: Store the extracted product details in a JSON file
    fs.writeFile('newproduct.json', JSON.stringify(allProducts, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log(`All extracted product details have been saved. Total products: ${allProducts.length}`);
      }
    });
  };

  // Navigate to the last page first
  await navigateToLastPage();

  // Extract product details from the last page to the first
  await extractProductDetailsFromLastToFirstPage();

  await browser.close();
})();
