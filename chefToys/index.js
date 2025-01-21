// const puppeteer = require('puppeteer');
// const fs = require('fs');

// (async () => {
//   const baseUrl = 'https://chefstoys.com/collections/reach-in-refrigerators-freezers';
//   const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
//   const page = await browser.newPage();

//   try {
//     console.log(`Navigating to collection page: ${baseUrl}`);
//     await page.goto(baseUrl, { waitUntil: 'networkidle2' });

//     console.log('Fetching all product URLs...');
//     // Collect all product URLs
//     // const productUrls = await page.evaluate(() => {
//     //   return Array.from(document.querySelectorAll('.ais-Hits')).map((el) => el.href);
//     // });
//     const productUrls = await page.evaluate(() => {
//   return Array.from(document.querySelectorAll('.ais-Hits a'))
//     .map((el) => el.href)
//     .filter((href) => href); // Filter out any undefined or null hrefs
// });


//     console.log(`Found ${productUrls.length} products.`);
//     const allProductDetails = [];

//     // Loop through each product URL
//     for (const productUrl of productUrls) {
//       console.log(`Scraping product details from: ${productUrl}`);
//       await page.goto(productUrl, { waitUntil: 'networkidle2' });

//       // Extract product details
//       const productDetails = await page.evaluate(() => {
//         const title = document.querySelector('h1.product-single__title')?.textContent?.trim() || null;
//         const sku = document.querySelector('span[data-sku-id]')?.textContent?.trim() || null;
//         const mpn = document.querySelector('span[data-sku-id] ~ span')?.textContent?.trim() || null;
//         const price = document.querySelector('span.product__price')?.textContent?.replace(/\s+/g, ' ').trim() || null;
//         const description = document.querySelector('.pdescription_block .rte')?.innerText.trim() || null;
//         const features = Array.from(document.querySelectorAll('.featuresbullets li')).map((li) => li.textContent.trim());
//         const shippingInfo = document.querySelector('.shipping_leadtime small')?.textContent.trim() || null;
//         const badges = Array.from(document.querySelectorAll('.prod_details_badges img')).map((img) => ({
//           alt: img.alt || null,
//           src: img.src || null,
//         }));
//         const images = Array.from(document.querySelectorAll('.product__thumb img')).map((img) => ({
//           alt: img.alt || null,
//           src: img.getAttribute('data-srcset')?.split(' ')[0] || img.src,
//         }));
//         const specSheet = document.querySelector('a[href*="Spec Sheet"]')?.href || null;
//         const warranty = document.querySelector('a[href*="Warranty"]')?.href || null;
//         const manual = document.querySelector('a[href*="Manual"]')?.href || null;

//         return {
//           title,
//           sku,
//           mpn,
//           price,
//           description,
//           features,
//           shippingInfo,
//           badges,
//           images,
//           documents: {
//             specSheet,
//             warranty,
//             manual,
//           },
//         };
//       });

//       console.log(`Extracted details for: ${productDetails.title}`);
//       allProductDetails.push({ url: productUrl, ...productDetails });
//     }

//     // Save all product details to a JSON file
//     fs.writeFileSync('allProductDetails.json', JSON.stringify(allProductDetails, null, 2));
//     console.log('All product details saved to allProductDetails.json');
//   } catch (error) {
//     console.error('An error occurred:', error);
//   } finally {
//     await browser.close();
//   }
// })();
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const baseUrl = 'https://chefstoys.com/collections/reach-in-refrigerators-freezers';
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  try {
    console.log(`Navigating to collection page: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });

    console.log('Fetching all product URLs...');
    // Collect all product URLs
    const productUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.ais-Hits a'))
        .map((el) => el.href)
        .filter((href) => href); // Filter out any undefined or null hrefs
    });

    console.log(`Found ${productUrls.length} products.`);

    // Loop through each product URL
    const allProductDetails = [];
    for (const productUrl of productUrls) {
      console.log(`Scraping product details from: ${productUrl}`);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });

      // Extract product details
      const productDetails = await page.evaluate((url) => {
        const title = document.querySelector('h1.product-single__title')?.textContent?.trim() || null;
        const sku = document.querySelector('span[data-sku-id]')?.textContent?.trim() || null;
        const mpn = document.querySelector('span[data-sku-id] ~ span')?.textContent?.trim() || null;
        const price = document.querySelector('span.product__price')?.textContent?.replace(/\s+/g, ' ').trim() || null;
        const description = document.querySelector('.pdescription_block .rte')?.innerText.trim() || null;
        const features = Array.from(document.querySelectorAll('.featuresbullets li')).map((li) => li.textContent.trim());
        const shippingInfo = document.querySelector('.shipping_leadtime small')?.textContent.trim() || null;
        const badges = Array.from(document.querySelectorAll('.prod_details_badges img')).map((img) => ({
          alt: img.alt || null,
          src: img.src || null,
        }));
        const images = Array.from(document.querySelectorAll('.product__thumb img')).map((img) => ({
          alt: img.alt || null,
          src: img.getAttribute('data-srcset')?.split(' ')[0] || img.src,
        }));
        const specSheet = document.querySelector('a[href*="Spec Sheet"]')?.href || null;
        const warranty = document.querySelector('a[href*="Warranty"]')?.href || null;
        const manual = document.querySelector('a[href*="Manual"]')?.href || null;

        return {
          title,
          sku,
          mpn,
          price,
          description,
          features,
          shippingInfo,
          badges,
          images,
          contentUrl: url, // Include content URL
          documents: {
            specSheet,
            warranty,
            manual,
          },
        };
      }, productUrl);

      console.log(`Extracted details for: ${productDetails.title}`);
      allProductDetails.push(productDetails);

      // Save each product immediately to avoid data loss
      let existingData = [];
      if (fs.existsSync('allProductDetails.json')) {
        const fileData = fs.readFileSync('allProductDetails.json', 'utf8');
        existingData = JSON.parse(fileData);
      }
      existingData.push(productDetails);
      fs.writeFileSync('allProductDetails.json', JSON.stringify(existingData, null, 2));
      console.log(`Saved product details for: ${productDetails.title}`);
    }

    console.log('Scraping completed.');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
})();
