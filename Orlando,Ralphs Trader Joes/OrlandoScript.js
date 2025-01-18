
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = 'https://net3.necs.com/orlandoimports/site/catalog/95+STORAGE'; // Target page URL

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log("Navigating to target page...");
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Function to extract product details for all products on the page with raw logging
    const extractProducts = async () => {
      console.log("Extracting products from the page...");
      const products = await page.evaluate(() => {
        // Using a more general selector if the structure is unknown or inconsistent
        const productElements = Array.from(document.querySelectorAll('div, section, article')); // Adjust for broader capture

        if (!productElements.length) {
          console.log("No product elements found. Check selectors.");
        }

        return productElements
          .map(product => {
            const name = product.querySelector('h3, .product-name, .title')?.innerText.trim() || null;
            const brand = product.querySelector('.brand, .product-brand, .brand-name')?.innerText.trim() || 'Unknown'; // Adjust as necessary
            const packSize = product.querySelector('.pack-size, .product-pack-size, .size')?.innerText.trim() || null; // Adjust as necessary
            const unit = product.querySelector('.unit, .product-unit')?.innerText.trim() || null; // Adjust as necessary
            const itemNumber = product.querySelector('.item-number, .product-item-number')?.innerText.trim() || null; // Adjust as necessary
            const category = document.querySelector('.breadcrumb a:last-child')?.innerText.trim() || 'Unknown';
            const itemCode = Array.from(product.querySelectorAll('span, p')).find(span => span.innerText.includes('Code'))?.innerText.replace('Code:', '').trim() || null;
            const upc = Array.from(product.querySelectorAll('span, p')).find(span => span.innerText.includes('UPC'))?.innerText.replace('UPC:', '').trim() || null;
            const imageUrl = product.querySelector('img')?.src || null;
            const availability = product.innerText.includes('Out of stock') ? 'Out of stock' : 'Available';
            if (name) {
              console.log(`Found product: ${name}`);
              return {
                name,
                category,
                itemCode,
                upc,
                imageUrl,
                availability,
              };
            }
            return null;
          })
          .filter(Boolean);
      });

      console.log(`Extracted ${products.length} products.`);
      return products;
    };

    // Collect products from the page
    let allProducts = await extractProducts();

    // Log extracted products to verify content before filtering
    console.log("Products extracted (before filtering):", allProducts);

    // Remove duplicates based on 'name' and 'itemCode' combination
    const uniqueProducts = Array.from(
      new Map(allProducts.map(product => [`${product.name}-${product.itemCode}`, product])).values()
    );

    console.log(`Filtered to ${uniqueProducts.length} unique products.`);

    // Save the unique data to a JSON file
    console.log("Saving collected data to products.json...");
    fs.writeFileSync('products.json', JSON.stringify(uniqueProducts, null, 2), 'utf-8');
    console.log('Data has been saved to products.json');

  } catch (error) {
    console.error("An error occurred during the process:", error);
  } finally {
    console.log("Closing browser...");
    await browser.close();
  }
})();
