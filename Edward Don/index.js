// import fs from 'fs';
// import fetch from 'node-fetch'; // Ensure you're using node-fetch
// import productList from './tableService/tabletopAssecories/data.js'; // Your product list

// const proxyConfig = {
//     host: 'proxy.goproxy.com',
//     port: 30000,
//     auth: {
//       username: 'customer-y52m704320',
//       password: 'fnest8mk'
//     }
// };


// // Batch size configuration
// const BATCH_SIZE = 100; // Number of products to fetch per batch
// const DELAY_BETWEEN_BATCHES = 1; // 1 second delay between batches (optional for rate-limiting)

// async function fetchProductIDsInBatch(batch) {
//     const batchData = [];

//     for (let i = 0; i < batch.length; i++) {
//         let name = batch[i]?.name;
//         let id = batch[i]?.id;
//         console.log(`--------------------${i} , ${id}---------------`);

//         try {
//             let url1 = `https://www.don.com/api/v1/don/analytics/productimpressions?productId=${id}&includePrices=true`;
//             let url2 = `https://www.don.com/api/v1/don/structureddata/Product?parameter1=${name}`;

//             const options = {
//                 method: 'GET',
//                 proxy: proxyConfig // Attach proxy agent here
//             };

//             // Fetching data from both URLs
//             const [res1, res2] = await Promise.all([fetch(url1, options), fetch(url2, options)]);

//             // Checking if both requests were successful
//             if (!res1.ok) {
//                 console.error(`Error fetching data for product ${id}: ${res1.status} ${res1.statusText}`);
//                 continue;
//             }
//             if (!res2.ok) {
//                 console.error(`Error fetching data for product ${name}: ${res2.status} ${res2.statusText}`);
//                 continue;
//             }

//             const result1 = await res1.text();
//             const result2 = await res2.text();

//             // Handle HTML response instead of JSON
//             if (result1.startsWith('<')) {
//                 console.error(`Error: Received HTML instead of JSON for product ${id}`);
//                 continue;
//             }
//             if (result2.startsWith('<')) {
//                 console.error(`Error: Received HTML instead of JSON for product ${name}`);
//                 continue;
//             }

//             const jsonResult1 = JSON.parse(result1);
//             const jsonResult2 = JSON.parse(result2);

//             // Combine the two results
//             const finalData = { ...jsonResult1[0], ...jsonResult2 };
//             batchData.push(finalData);
//         } catch (error) {
//             console.error(`Error fetching data for product ${id}:`, error);
//         }
//     }

//     return batchData;
// }

// async function fetchProductIDs() {
//     const allData = [];
//     const totalBatches = Math.ceil(productList.length / BATCH_SIZE);

//     for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
//         const start = batchIndex * BATCH_SIZE;
//         const end = start + BATCH_SIZE;
//         const currentBatch = productList.slice(start, end);

//         console.log(`Fetching batch ${batchIndex + 1} of ${totalBatches}...`);
//         const batchData = await fetchProductIDsInBatch(currentBatch);
//         allData.push(...batchData);

//         // Optional delay to avoid overwhelming the server
//         if (batchIndex < totalBatches - 1) {
//             await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
//         }
//     }

//     return allData;
// }

// function saveToFile(filename, data) {
//     fs.writeFileSync(`${filename}.json`, JSON.stringify(data, null, 2), 'utf-8');
//     console.log(`Data saved to ${filename}.json`);
// }

// (async function () {
//     const material = await fetchProductIDs();
//     saveToFile(`tabletopAssecories`, material);
//     console.log(`File save done.`);
// })();
import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeRalphsProductDetails() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-http2', '--disable-cache']
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0); // Disable navigation timeout

  try {
    const maxRetries = 3;
    let attempt = 0;
    let navigationSuccessful = false;

    // Retry mechanism for page navigation
    while (!navigationSuccessful && attempt < maxRetries) {
      try {
        console.log(`Attempt ${attempt + 1} to navigate to the product page...`);
        await page.goto('https://www.ralphs.com/p/kroger-original-sour-cream/0001111046070', {
          waitUntil: 'networkidle2',
        });
        navigationSuccessful = true;
      } catch (error) {
        console.error(`Navigation attempt ${attempt + 1} failed. Retrying...`);
        attempt += 1;
        if (attempt >= maxRetries) throw new Error('Maximum navigation attempts reached.');
      }
    }

    // Wait for product details selector to be available
    await page.waitForSelector('.ProductDetails-header', { timeout: 60000 });

    // Extract product details
    const productDetails = await page.evaluate(() => {
      const name = document.querySelector('.ProductDetails-header')?.innerText || 'UnnamedProduct';
      const price = document.querySelector('[data-qa="cart-page-item-price"] mark')?.innerText || '';
      const rating = document.querySelector('[data-testid="rating_summary"] .kds-Text--m')?.innerText || '';
      const upc = document.querySelector('[data-testid="product-details-upc"]')?.innerText.replace('UPC: ', '') || 'unknown';
      const imageUrl = document.querySelector('[data-testid="main-image-container"] img')?.src || '';
      const locatedIn = document.querySelector('[data-testid="product-details-location"]')?.innerText || '';

      return { name, price, rating, upc, imageUrl, locatedIn };
    });

    console.log('Product Details:', productDetails);

    // Save product details immediately to a JSON file
    const productFileName = `${productDetails.name.replace(/\s+/g, '_')}_${productDetails.upc}.json`;
    fs.writeFileSync(productFileName, JSON.stringify({ productDetails }, null, 2), 'utf8');
    console.log(`Product data saved to ${productFileName}`);

    // Click to load more reviews until all are loaded
    const reviews = [];
    let loadMoreVisible = true;

    while (loadMoreVisible) {
      try {
        await page.click('[data-testid="view-more-reviews"]');
        await page.waitForTimeout(2000); // Adjust timeout based on loading speed
      } catch (error) {
        loadMoreVisible = false;
      }
    }

    // Extract review details
    const reviewsData = await page.evaluate(() => {
      const reviewElements = Array.from(document.querySelectorAll('[data-testid="reviews-tile"]'));

      return reviewElements.map(review => ({
        title: review.querySelector('.ReviewTile--header')?.innerText || '',
        date: review.querySelector('.kds-Text--s.text-neutral-less-prominent')?.innerText || '',
        content: review.querySelector('.ReviewTile--text-collapsed')?.innerText || '',
        rating: review.querySelectorAll('.kds-Icon--utilityExtraSmall.text-accent-more-prominent').length
      }));
    });

    reviews.push(...reviewsData);

    // Save reviews to a separate JSON file
    const reviewsFileName = `reviews_${productDetails.name.replace(/\s+/g, '_')}_${productDetails.upc}.json`;
    fs.writeFileSync(reviewsFileName, JSON.stringify({ reviews }, null, 2), 'utf8');
    console.log(`Reviews saved to ${reviewsFileName}`);

    await browser.close();
    return { productDetails, reviews };
  } catch (error) {
    console.error('Error during scraping:', error);
    await browser.close();
    return null;
  }
}

scrapeRalphsProductDetails();
