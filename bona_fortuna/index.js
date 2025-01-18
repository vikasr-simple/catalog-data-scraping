const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://bonafurtuna.com/collections/sicilian-products?page=5', {
    waitUntil: 'networkidle2',
  });

  // Extract product URLs from the collection page
  const productUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-item__link')).map((link) => link.href);
  });

  let products = [];

  // Iterate through each product URL and extract details
  for (const url of productUrls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      const product = await page.evaluate(() => {
        const title = document.querySelector('h1.product-title, h1.product__title')?.innerText.trim() || 'N/A';
        const price = document.querySelector('.product__price')?.innerText.trim() || 'N/A';
        const description = document.querySelector('.product__description')?.innerText.trim() || 'N/A';
        const availability = document.querySelector('.stock-status')?.innerText.trim() || 'N/A';
        const images = Array.from(document.querySelectorAll('.product-item__image, .product__thumbnail-image')).map(img => img.src);
        const brand = document.querySelector('h2.product__brand')?.innerText.trim() || 'N/A';
        const rating = document.querySelector('.stamped-badge')?.getAttribute('data-rating') || 'N/A';
        const reviewsCount = document.querySelector('.stamped-badge-caption')?.getAttribute('data-reviews') || 'N/A';
        const sizes = Array.from(document.querySelectorAll('.product__available-sizes .product__opt-label')).map(size => size.innerText.trim());

        // Extract award information
        const awards = Array.from(document.querySelectorAll('.product__awards .award-item img')).map(img => ({
          alt: img.alt,
          src: img.src,
        }));

        // Extract price options for each size
        const sizeOptions = Array.from(document.querySelectorAll('.product__available-sizes .product__opt-label')).map(option => {
          const [size, price] = option.innerText.split('  ');
          return {
            size: size.trim(),
            price: price.trim(),
            available: !option.previousElementSibling.hasAttribute('disabled')
          };
        });

        // Extract subscription options
        const subscriptionOptions = Array.from(document.querySelectorAll('.rc-radio__label')).map(option => option.innerText.trim());

        return {
          title,
          price,
          description,
          availability,
          brand,
          rating,
          reviewsCount,
          sizes,
          images,
          awards,
          sizeOptions,
          subscriptionOptions,
          url: window.location.href,
        };
      });

      products.push(product);
      console.log(`Extracted: ${product.title}`);
    } catch (error) {
      console.error(`Error extracting data from ${url}:`, error);
    }
  }

  // Save the extracted data to a JSON file
  fs.writeFileSync('sicilian_products4.json', JSON.stringify(products, null, 2));

  await browser.close();
  console.log('Scraping complete. Data saved to sicilian_products.json');
})();

// Arrabbiata Marinara Pasta Sauce -- 680ml