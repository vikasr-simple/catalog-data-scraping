const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const url = 'https://westcoastprimemeats.com/product-category/meat-products/seafood/';
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Scroll until all products are loaded
  let previousHeight;
  while (true) {
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for lazy-loading to load more products
    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) break; // Exit loop if no more new content is loaded
  }

  // Extract product URLs from the main listing page
  const productUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.fl-post-grid-post a[rel="bookmark"]')).map(a => a.href);
  });

  const products = [];

  // Visit each product page to extract its details
  for (let productUrl of productUrls) {
    await page.goto(productUrl, { waitUntil: 'networkidle2' });

    // Extract product details: name, price, portion sizes, pack sizes, descriptions, stock status, will call, home delivery info, and image URL
    const product = await page.evaluate(() => {
      const name = document.querySelector('.product_title')?.innerText || 'N/A';
      const price = document.querySelector('.price bdi')?.innerText || 'N/A';
      const portionSize = document.querySelector('.woocommerce-product-details__short-description p:nth-child(1)')?.innerText || 'N/A';
      const packSize = document.querySelector('.woocommerce-product-details__short-description p:nth-child(2)')?.innerText || 'N/A';
      let description = document.querySelector('.woocommerce-product-details__short-description')?.innerText || 'N/A';
      description = description.replace(/\n/g, ' '); // Remove newline characters from description
      const stockStatus = document.querySelector('.stock')?.innerText || 'N/A';
      const willCallInfo = document.querySelector('.fl-rich-text p:nth-of-type(1)')?.innerText || 'N/A';
      const homeDeliveryInfo = document.querySelector('.fl-rich-text p:nth-of-type(2)')?.innerText || 'N/A';
      const imageUrl = document.querySelector('.fl-photo-img')?.src || 'N/A';

      return { name, price, portionSize, packSize, description, stockStatus, willCallInfo, homeDeliveryInfo, imageUrl };
    });

    products.push({ url: productUrl, ...product });
  }

  // Save products to a JSON file
  fs.writeFileSync('seafood.json', JSON.stringify(products, null, 2));
  console.log('Extracted Products saved to products.json');

  await browser.close();
})();
