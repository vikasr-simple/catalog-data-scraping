// const fs = require('fs');
// const puppeteer = require('puppeteer');

// (async () => {
//   const MAX_RETRIES = 3;
//   const MAX_PAGES = 60;

//   const initializeBrowser = async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     page.setDefaultNavigationTimeout(60000);
//     return { browser, page };
//   };

//   let { browser, page } = await initializeBrowser();

//   let totalProductsScraped = 0; // Counter to track total number of products scraped

//   // Loop through each page up to MAX_PAGES
//   for (let currentPage = 1; currentPage <= MAX_PAGES; currentPage++) {
//     const pageUrl = `https://www.imperialdade.com/catalog/foodservice/foodservice-packaging-supplies?cid=WCL2015p=${currentPage}`;
//     console.log(`Collecting product data from page ${currentPage}: ${pageUrl}`);

//     try {
//       // Navigate to the URL of the current page
//       await page.goto(pageUrl, { waitUntil: 'networkidle2' });

//       // Wait for the product list to load
//       await page.waitForSelector('article[data-testid="plp-card"]', { timeout: 30000 });

//       // Extract product details for each product on the page
//       const productData = await page.evaluate(() => {
//         const products = document.querySelectorAll('article[data-testid="plp-card"]');
//         return Array.from(products).map(product => {
//           const name = product.querySelector('.product-detail a h3')?.innerText.trim() || 'N/A';
//           const sku = product.querySelector('.label-container span:nth-of-type(1) .text-wrap')?.innerText.trim() || 'N/A';
//           const manufacturerCode = product.querySelector('.label-container span:nth-of-type(2) .text-wrap')?.innerText.trim() || 'N/A';
//           const imageUrl = product.querySelector('.product-image-desktop img')?.src || 'N/A';
//           const productUrl = product.querySelector('.product-image-desktop a')?.href || 'N/A';

//           return { name, sku, manufacturerCode, imageUrl, productUrl };
//         });
//       });

//       if (productData.length === 0) {
//         console.log(`No products found on page ${currentPage}. Ending pagination.`);
//         break;
//       }

//       // Go to each product page to fetch all specifications
//       for (let product of productData) {
//         let retries = 0;
//         let success = false;

//         while (retries < MAX_RETRIES && !success) {
//           try {
//             console.log(`Navigating to product page for ${product.name} (Attempt ${retries + 1})`);
//             await page.goto(product.productUrl, { waitUntil: 'networkidle2' });
            
//             // Wait for the Specifications section to load
//             await page.waitForSelector('ul[data-testid="specifications-list"]', { timeout: 30000 });

//             // Extract all specifications from the Specifications section
//             const specifications = await page.evaluate(() => {
//               const specItems = document.querySelectorAll('ul[data-testid="specifications-list"] li');
//               const specs = {};
//               specItems.forEach(item => {
//                 const key = item.querySelector('p.font-bold')?.innerText.trim() || 'N/A';
//                 const value = item.querySelector('p.font-normal')?.innerText.trim() || 'N/A';
//                 specs[key] = value;
//               });
//               return specs;
//             });

//             product.specifications = specifications;
//             success = true;

//           } catch (error) {
//             console.error(`Error fetching specifications for ${product.name}: ${error.message}`);
//             retries++;
//             await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before retrying
//           }
//         }

//         if (!success) {
//           console.log(`Failed to fetch specifications for ${product.name} after ${MAX_RETRIES} attempts.`);
//           product.specifications = {};
//         }

//         // Save product data to JSON file immediately
//         const fileName = 'foodservice-packaging-supplies.json';
//         let existingProducts = [];

//         // Read existing data from the file if it exists
//         if (fs.existsSync(fileName)) {
//           const fileContents = fs.readFileSync(fileName, 'utf8');
//           if (fileContents) {
//             existingProducts = JSON.parse(fileContents);
//           }
//         }

//         // Append the new product data to the existing products
//         existingProducts.push(product);

//         // Write the updated product list back to the file
//         fs.writeFileSync(fileName, JSON.stringify(existingProducts, null, 2), 'utf8');
//         totalProductsScraped++;  // Increment product counter
//         console.log(`Product data for ${product.name} saved immediately. Total products scraped: ${totalProductsScraped}`);
//       }

//     } catch (error) {
//       console.error(`Error on page ${currentPage}: ${error.message}`);
//       break;
//     }
//   }

//   console.log(`Scraping complete. Total products scraped: ${totalProductsScraped}`);

//   // Close the browser
//   await browser.close();
// })();
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const MAX_RETRIES = 3;
  const MAX_PAGES = 60;
  const START_PRODUCT_NO = 1; // Starting product number
  const START_PAGE = 1; // Page to start from

  const initializeBrowser = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    return { browser, page };
  };

  let { browser, page } = await initializeBrowser();

  let totalProductsScraped = 0; // Counter to track total number of products scraped
  let currentProductNumber = 1; // Tracker for the current product number across pages

  // Loop through each page up to MAX_PAGES
  for (let currentPage = START_PAGE; currentPage <= MAX_PAGES; currentPage++) {
    const pageUrl = `https://www.imperialdade.com/catalog/foodservice/restaurant-furniture?cid=WCL2032&p=${currentPage}`;
    console.log(`Collecting product data from page ${currentPage}: ${pageUrl}`);

    try {
      // Navigate to the URL of the current page
      await page.goto(pageUrl, { waitUntil: 'networkidle2' });

      // Wait for the product list to load
      await page.waitForSelector('article[data-testid="plp-card"]', { timeout: 30000 });

      // Extract product details for each product on the page
      const productData = await page.evaluate(() => {
        const products = document.querySelectorAll('article[data-testid="plp-card"]');
        return Array.from(products).map(product => {
          const name = product.querySelector('.product-detail a h3')?.innerText.trim() || 'N/A';
          const sku = product.querySelector('.label-container span:nth-of-type(1) .text-wrap')?.innerText.trim() || 'N/A';
          const manufacturerCode = product.querySelector('.label-container span:nth-of-type(2) .text-wrap')?.innerText.trim() || 'N/A';
          const imageUrl = product.querySelector('.product-image-desktop img')?.src || 'N/A';
          const productUrl = product.querySelector('.product-image-desktop a')?.href || 'N/A';

          return { name, sku, manufacturerCode, imageUrl, productUrl };
        });
      });

      if (productData.length === 0) {
        console.log(`No products found on page ${currentPage}. Ending pagination.`);
        break;
      }

      // Skip products until reaching the specified starting product number
      let startIndex = 0;
      if (currentPage === START_PAGE) {
        startIndex = START_PRODUCT_NO - currentProductNumber;
      }
      currentProductNumber += productData.length;

      // Go to each product page to fetch all specifications
      for (let i = startIndex; i < productData.length; i++) {
        const product = productData[i];
        let retries = 0;
        let success = false;

        while (retries < MAX_RETRIES && !success) {
          try {
            console.log(`Navigating to product page for ${product.name} (Attempt ${retries + 1})`);
            await page.goto(product.productUrl, { waitUntil: 'networkidle2' });
            
            // Wait for the Specifications section to load
            await page.waitForSelector('ul[data-testid="specifications-list"]', { timeout: 30000 });

            // Extract all specifications from the Specifications section
            const specifications = await page.evaluate(() => {
              const specItems = document.querySelectorAll('ul[data-testid="specifications-list"] li');
              const specs = {};
              specItems.forEach(item => {
                const key = item.querySelector('p.font-bold')?.innerText.trim() || 'N/A';
                const value = item.querySelector('p.font-normal')?.innerText.trim() || 'N/A';
                specs[key] = value;
              });
              return specs;
            });

            product.specifications = specifications;
            success = true;

          } catch (error) {
            console.error(`Error fetching specifications for ${product.name}: ${error.message}`);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before retrying
          }
        }

        if (!success) {
          console.log(`Failed to fetch specifications for ${product.name} after ${MAX_RETRIES} attempts.`);
          product.specifications = {};
        }

        // Save product data to JSON file immediately
        const fileName = 'restaurant-furniture.json';
        let existingProducts = [];

        // Read existing data from the file if it exists
        if (fs.existsSync(fileName)) {
          const fileContents = fs.readFileSync(fileName, 'utf8');
          if (fileContents) {
            existingProducts = JSON.parse(fileContents);
          }
        }

        // Append the new product data to the existing products
        existingProducts.push(product);

        // Write the updated product list back to the file
        fs.writeFileSync(fileName, JSON.stringify(existingProducts, null, 2), 'utf8');
        totalProductsScraped++;  // Increment product counter
        console.log(`Product data for ${product.name} saved immediately. Total products scraped: ${totalProductsScraped}`);
      }

    } catch (error) {
      console.error(`Error on page ${currentPage}: ${error.message}`);
      break;
    }
  }

  console.log(`Scraping complete. Total products scraped: ${totalProductsScraped}`);

  // Close the browser
  await browser.close();
})();
