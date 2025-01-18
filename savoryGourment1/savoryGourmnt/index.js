// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const { log } = require('console');

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   const baseUrl = 'https://savorygourmet.com';
//   const pageNo =4;
//   const collectionUrl = `${baseUrl}/collections/chocolate-manufacturer?page=${pageNo}`;

//   // Navigate to collection page and extract all product URLs
//   await page.goto(collectionUrl, { waitUntil: 'load', timeout: 0 });
  
//   const productUrls = await page.evaluate(() => {
//     const productLinks = Array.from(document.querySelectorAll('li.productgrid--item a.productitem--image-link'));
//     console.log('Extracted product links:', productLinks.map(link => link.href));
//     return productLinks.map(link => link.href);
//   });

//   console.log('Product URLs:', productUrls);
//   console.log(productUrls.length);
  

//   if (productUrls.length === 0) {
//     console.error('No products found on the collection page.');
//     await browser.close();
//     return;
//   }

//   // Create an empty array to store product details
//   let productDetails = [];

//   // Loop through each product URL and extract details
//   for (const url of productUrls) {
//     console.log('Navigating to product URL:', url);
//     await page.goto(url, { waitUntil: 'load', timeout: 0 });

//     const details = await page.evaluate((url) => {
//       const name = document.querySelector('.product-title')?.innerText.trim() || 'N/A';
//       const sku = document.querySelector('.product-sku span')?.innerText.trim() || 'N/A';
//       const brand = document.querySelector('.product-vendor a')?.innerText.trim() || 'N/A';
//       const image = document.querySelector('.product-gallery--image img')?.src || 'N/A';
//       const content_url = url;

//       return {
//         name,
//         sku,
//         brand,
//         image,
//         content_url
//       };
//     }, url);

//     console.log('Extracted product details:', details);
//     productDetails.push(details);
//   }

//   // Write product details to a JSON file
//   fs.writeFileSync('chocolate-manufacturer3.json', JSON.stringify(productDetails, null, 2));

//   console.log('Product details extracted and saved successfully.');

//   await browser.close();
// })();


//////////////////// extrated size also ///////////



const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseUrl = 'https://savorygourmet.com';
  const pageNo = 4;
  const collectionUrl = `${baseUrl}/collections/clearance?page=${pageNo}`;

  // Navigate to collection page and extract all product URLs
  await page.goto(collectionUrl, { waitUntil: 'load', timeout: 0 });

  const productUrls = await page.evaluate(() => {
    const productLinks = Array.from(document.querySelectorAll('li.productgrid--item a.productitem--image-link'));
    return productLinks.map(link => link.href);
  });

  if (productUrls.length === 0) {
    console.error('No products found on the collection page.');
    await browser.close();
    return;
  }
console.log(productUrls.length);

  // Create an empty array to store product details
  let productDetails = [];

  // Loop through each product URL and extract details
  for (const url of productUrls) {
    console.log('Navigating to product URL:', url);
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    const details = await page.evaluate((url) => {
      const name = document.querySelector('.product-title')?.innerText.trim() || 'N/A';
      const sku = document.querySelector('.product-sku span')?.innerText.trim() || 'N/A';
      const brand = document.querySelector('.product-vendor a')?.innerText.trim() || 'N/A';
      const image = document.querySelector('.product-gallery--image img')?.src || 'N/A';
      const size = Array.from(document.querySelectorAll('.form-field-input.form-field-select option'))
        .map(option => option.innerText.trim())
        .join(', ') || 'N/A'; // Extracts all available sizes
      const content_url = url;
      // Force open the <details> element
  const detailsElement = document.querySelector('details');
  if (detailsElement && !detailsElement.hasAttribute('open')) {
    detailsElement.setAttribute('open', '');
  }

  // Select description inside <details>
  const description = document.querySelector('details > .indent-content p')?.innerText.trim() || '';

      return {
        name,
        sku,
        brand,
        size,
        image,
        content_url,
        description
      };
    }, url);

    console.log('Extracted product details:', details);
    productDetails.push(details);
  }

  // Write product details to a JSON file
  fs.writeFileSync('clearance4.json', JSON.stringify(productDetails, null, 2));

  console.log('Product details extracted and saved successfully.');

  await browser.close();
})();

