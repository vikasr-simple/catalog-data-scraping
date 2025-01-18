// const puppeteer = require('puppeteer');
// const fs = require('fs');

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto('https://www.melissas.com/collections/all-fruit?view=view-48&grid_list=grid-view', { waitUntil: 'domcontentloaded', timeout: 60000 });

//   let allProducts = [];
//   let hasNextPage = true;
//   let visitedUrls = new Set();

//   while (hasNextPage) {
//     // Extract product URLs from the current page
//     const productUrls = await page.evaluate(() => {
//       return Array.from(document.querySelectorAll('.productitem a.productitem--image-link')).map(a => a.href);
//     });

//     // Visit each product page to extract more details
//     for (const productUrl of productUrls) {
//       if (!visitedUrls.has(productUrl)) {
//         visitedUrls.add(productUrl);
//         await page.goto(productUrl, { waitUntil: 'networkidle0', timeout: 60000 });

//         const productDetails = await page.evaluate(() => {
//           const name = document.querySelector('.productitem--title a')?.innerText.trim();
//           const price = document.querySelector('.price--main .money')?.innerText.trim();
//           const description = document.querySelector('.productitem--description p')?.innerText.trim();
//           const packMatch = description.match(/Quantity\/Pack: ([^]+)/);
//           const pack = packMatch ? packMatch[1].trim() : null;
//           const sku = document.querySelector('.product-sku span[data-product-sku]')?.innerText.trim();
//           let imageUrl = document.querySelector('.productitem--image-primary')?.getAttribute('src');
//           if (imageUrl && imageUrl.startsWith('//')) {
//             imageUrl = 'https:' + imageUrl;
//           }
//           const contentUrl = window.location.href;
//           return { name, price, description, pack, sku, imageUrl, contentUrl };
//         });

//         allProducts.push(productDetails);
//       }
//     }

//     // Check if there is a next page and navigate to it
//     const nextPageLink = await page.$('.pagination--item[aria-label="Go to next page"]');
//     if (nextPageLink) {
//       await Promise.all([
//         page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
//         nextPageLink.click(),
//       ]);
//     } else {
//       hasNextPage = false;
//     }
//   }

//   // Save extracted data to a JSON file
//   fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 2));

//   console.log(`Total products extracted: ${allProducts.length}`);
//   await browser.close();
//   console.log('Scraping complete. Data saved to products.json');
// })();
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.setDefaultNavigationTimeout(120000); // Set default navigation timeout to 120 seconds

  await page.goto('https://www.melissas.com/collections/asian-fruit?view=view-48&grid_list=grid-view', { waitUntil: 'domcontentloaded', timeout: 60000 });

  let allProducts = [];
  let hasNextPage = true;
  let visitedUrls = new Set();

  while (hasNextPage) {
    // Extract product URLs from the current page
    const productUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.productitem a.productitem--image-link')).map(a => a.href);
    });

    // Visit each product page to extract more details
    for (const productUrl of productUrls) {
      if (!visitedUrls.has(productUrl)) {
        visitedUrls.add(productUrl);

        // Retry mechanism for navigating to product pages
        const MAX_RETRIES = 3;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            await page.goto(productUrl, { waitUntil: 'networkidle0', timeout: 120000 });
            break; // Exit loop if navigation succeeds
          } catch (error) {
            console.warn(`Attempt ${attempt + 1} failed to load page: ${productUrl}`);
            if (attempt === MAX_RETRIES - 1) {
              console.error(`Skipping page: ${productUrl}`);
              continue;
            }
          }
        }

        // Extract product details
        const productDetails = await page.evaluate(() => {
          const name = document.querySelector('.productitem--title a')?.innerText.trim();
          const price = document.querySelector('.price--main .money')?.innerText.trim();
          const description = document.querySelector('.productitem--description p')?.innerText.trim();
          const packMatch = description ? description.match(/Quantity\/Pack: ([^Seasonality]+)/) : null;
          const pack = packMatch ? packMatch[1].trim() : null;
          const sku = document.querySelector('.product-sku span[data-product-sku]')?.innerText.trim();
          let imageUrl = document.querySelector('.productitem--image-primary')?.getAttribute('src');
          if (imageUrl && imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          }
          const contentUrl = window.location.href;
          return { name, price, description, pack, sku, imageUrl, contentUrl };
        });

        allProducts.push(productDetails);

        // Optional delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    // Check if there is a next page and navigate to it
    const nextPageLink = await page.$('.pagination--item[aria-label="Go to next page"]');
    if (nextPageLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        nextPageLink.click(),
      ]);
    } else {
      hasNextPage = false;
    }
  }

  // Save extracted data to a JSON file
  fs.writeFileSync('AsianFruit.json', JSON.stringify(allProducts, null, 2));

  console.log(`Total products extracted: ${allProducts.length}`);
  await browser.close();
  console.log('Scraping complete. Data saved to products.json');
})();
