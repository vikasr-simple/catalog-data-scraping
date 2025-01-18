const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = 'https://www.acehardware.com/departments/lawn-and-garden/lawn-care/lawn-fertilizers';

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the page
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    // Wait for the product list to load
    await page.waitForSelector('li.mz-productlist-item');

    // Extract product data
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('li.mz-productlist-item');
      const baseUrl = 'https://www.acehardware.com/departments/lawn-and-garden/lawn-care/lawn-fertilizers/';

      const productData = [];

      productElements.forEach((product) => {
        const nameElement = product.querySelector('.mz-productlisting-title');
        const imageElement = product.querySelector('.mz-productlisting-image img');
        const priceElement = product.querySelector('.price-section .custom-price');
        const productCodeElement = product.querySelector('.productCode');
        const mfrCodeElement = product.querySelector('.mfrCode');
        const descriptionElement = product.querySelector('.description-container');
        const brandNameElement = product.querySelector('.shop-brand .brand-name');

        // Extract name
        const name = nameElement ? nameElement.textContent.trim() : 'No name available';

        // Extract image
        const image = imageElement ? imageElement.src : 'https://cdn-tp3.mozu.com/24645-37138/resources/images/placeholder-white.jpg';

        // Extract price
        const price = priceElement ? priceElement.textContent.trim() : 'Price not available';

        // Extract product code
        const productCode = productCodeElement ? productCodeElement.textContent.trim().replace('Item #', '').trim() : 'No product code';

        // Construct content URL
        const contentUrl = productCode !== 'No product code' ? ${baseUrl}${productCode} : 'No URL available';

        // Extract manufacturer code
        const mfrCode = mfrCodeElement ? mfrCodeElement.textContent.trim().replace('| Mfr #', '').trim() : 'No mfr code';

        // Extract description
        const description = descriptionElement ? descriptionElement.textContent.trim() : 'No description available';

        // Extract brand name
        const brandName = brandNameElement ? brandNameElement.textContent.trim() : 'No brand name available';

        productData.push({
          name,
          image,
          price,
          productCode,
          mfrCode,
          contentUrl,
          description,
          brandName,
        });
      });

      return productData;
    });

    // Save the data to a JSON file
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2), 'utf-8');
    console.log('Data saved to products.json');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();