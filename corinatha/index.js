const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let allProducts = [];
  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    console.log(`Extracting data from page ${currentPage}...`);
    try {
      await page.goto(`https://corinthiandistributors.com/shop/page/${currentPage}/`, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      console.error(`Failed to load page ${currentPage}:`, error);
      break;
    }

    // Extract product data from the current page
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.products .product');
      let productData = [];

      productElements.forEach((product) => {
        const title = product.querySelector('.woocommerce-loop-product__title')?.innerText.trim();
        const url = product.querySelector('a.woocommerce-LoopProduct-link')?.href;
        const imageUrl = product.querySelector('img')?.src;
        const sku = product.querySelector('.product-label-sku')?.textContent.trim().replace('SKU: ', '') || 'N/A';
        const description = product.querySelector('p')?.innerText.trim() || 'N/A';

        productData.push({ title, url, imageUrl, sku, description });
      });

      return productData;
    });

    console.log(`Extracted ${products.length} products from page ${currentPage}`);
    allProducts = allProducts.concat(products);

    // Check if there is a next page by looking for the next button
    hasNextPage = await page.$('.woocommerce-pagination .page-numbers.next, .woocommerce-pagination .page-numbers a.next') !== null;
    currentPage++;
  }

  console.log(`Total products extracted from all pages: ${allProducts.length}`);

  // Navigate to each product page and extract additional details
  for (let product of allProducts) {
    console.log(`Extracting additional details for product: ${product.title}`);
    try {
      await page.goto(product.url, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      console.error(`Failed to load product page for ${product.title}:`, error);
      continue;
    }

    const additionalDetails = await page.evaluate(() => {
      const productTitle = document.querySelector('.product_title.entry-title')?.innerText.trim() || 'N/A';
      const brand = document.querySelector('.woocommerce-product-attributes-item--attribute_pa_brand .woocommerce-product-attributes-item__value p a')?.innerText.trim() || 'N/A';
      const sku = document.querySelector('.sku_wrapper .sku')?.innerText.trim() || 'N/A';
      const category = document.querySelector('.posted_in a')?.innerText.trim() || 'N/A';
      const upc = document.querySelector('.woocommerce-product-attributes-item--attribute_upc .woocommerce-product-attributes-item__value p')?.innerText.trim() || 'N/A';
      const additionalInfo = document.querySelector('.woocommerce-product-details__short-description')?.innerText.trim() || 'N/A';
      const contentUrl = document.querySelector('link[rel="canonical"]')?.href || product.url;

      return {
        productTitle,
        brand,
        sku,
        category,
        upc,
        additionalInfo,
        contentUrl
      };
    });

    // Merge the additional details into the existing product data
    Object.assign(product, additionalDetails);
  }
console.log(all_products_details.length);

  // Save all extracted data to a JSON file
  fs.writeFileSync('all_products_details.json', JSON.stringify(allProducts, null, 2));

  console.log('Data extraction complete!');
  await browser.close();
})();