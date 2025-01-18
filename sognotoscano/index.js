const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseUrl = 'https://shop.sognotoscano.com/collections/pasta-grains-beans';

  let products = [];
  let hasNextPage = true;
  let currentPage = 1;

  // Function to safely navigate to a URL with retries
  async function safeGoto(page, url, options, retryCount = 3) {
    let attempts = 0;
    while (attempts < retryCount) {
      try {
        await page.goto(url, options);
        return;
      } catch (error) {
        console.log(`Attempt ${attempts + 1} to navigate to ${url} failed: ${error.message}`);
        attempts++;
        if (attempts >= retryCount) {
          throw error;
        }
      }
    }
  }

  // Step 1: Extract all product details including visiting each product page
  while (hasNextPage) {
    const url = `${baseUrl}?page=${currentPage}`;
    console.log(`Navigating to ${url}`);
    await safeGoto(page, url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Extract product links from the collection page
    const pageProducts = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.productitem');
      let productList = [];
      productElements.forEach((product) => {
        const link = product.querySelector('.productitem--image-link')?.href || '';
        const imageUrl = product.querySelector('.productitem--image-primary')?.src || '';

        productList.push({ link, imageUrl });
      });
      return productList;
    });

    // Visit each product link to get more details
    for (let product of pageProducts) {
      if (product.link) {
        console.log(`Navigating to product page: ${product.link}`);
        await safeGoto(page, product.link, { waitUntil: 'networkidle2', timeout: 60000 });

        try {
          // Wait for key elements to ensure the product page is fully loaded
          await page.waitForSelector('h1.product-single__title', { timeout: 10000 });

          // Extract product details from the product page
          const details = await page.evaluate(() => {
            const title = document.querySelector('h1.product-single__title')?.innerText.trim() || 'Title not found';
            const price = document.querySelector('.price__current .money')?.innerText.trim() || 'Price not found';
            const size = document.querySelector('div.product-block--product_size span')?.innerText.trim() || '';
            const weight = document.querySelector('.product-single__weight, .productitem--weight')?.innerText.trim() || '';
            const availability = document.querySelector('.product-single__availability, .productitem--availability')?.innerText.trim() || '';

            // Return the combined object with all product details
            return { title, price, size, weight, availability };
          });

          // Merge the extracted details (link, imageUrl) with the detailed product information
          const completeProduct = { ...product, ...details };

          // Log detailed product information for debugging purposes
          console.log(`Extracted details for product: ${JSON.stringify(completeProduct)}`);

          // Append detailed product to the main list
          products.push(completeProduct);

        } catch (error) {
          console.log(`Error extracting details for product at ${product.link}: ${error.message}`);
        }
      }
    }

    // Check if there is a next page
    hasNextPage = await page.evaluate(() => {
      const nextPageElement = document.querySelector('li.pagination--next a');
      return nextPageElement !== null;
    });

    currentPage++;
  }

  // Save all products to a final JSON file after extracting detailed info
  fs.writeFileSync('products_detailed.json', JSON.stringify(products, null, 2));
  console.log('Detailed product scraping completed. All products saved to products_detailed.json');

  await browser.close();
})();
