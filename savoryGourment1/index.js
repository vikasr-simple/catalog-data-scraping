const puppeteer = require('puppeteer');
const fs = require('fs');
const { log } = require('console');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseUrl = 'https://savorygourmet.com';
  const pageNo =3;
  const collectionUrl = `${baseUrl}/collections/herbs-spices-salt-pepper?page=${pageNo}`;

  // Navigate to collection page and extract all product URLs
  await page.goto(collectionUrl, { waitUntil: 'load', timeout: 0 });
  
  const productUrls = await page.evaluate(() => {
    const productLinks = Array.from(document.querySelectorAll('li.productgrid--item a.productitem--image-link'));
    console.log('Extracted product links:', productLinks.map(link => link.href));
    return productLinks.map(link => link.href);
  });

  console.log('Product URLs:', productUrls);
  console.log(productUrls.length);
  

  if (productUrls.length === 0) {
    console.error('No products found on the collection page.');
    await browser.close();
    return;
  }

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
      const content_url = url;

      return {
        name,
        sku,
        brand,
        image,
        content_url
      };
    }, url);

    console.log('Extracted product details:', details);
    productDetails.push(details);
  }

  // Write product details to a JSON file
  fs.writeFileSync('herbs-spices-salt-pepper3.json', JSON.stringify(productDetails, null, 2));

  console.log('Product details extracted and saved successfully.');

  await browser.close();
})();
