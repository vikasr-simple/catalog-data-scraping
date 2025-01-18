const puppeteer = require('puppeteer');

(async () => {
  const url = 'https://thecaviarco.com/collections/the-caviar-collection';
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Extract all product URLs from the page
  const productUrls = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.span-3.md-span-4.sm-span-6.auto.product-index a'));
    return links.map(link => link.href);
  });

  if (productUrls.length === 0) {
    console.error('No product URLs found. Please check the selector.');
  }

  const products = [];

  // Iterate over each product URL and extract data
  for (const productUrl of productUrls) {
    await page.goto(productUrl, { waitUntil: 'networkidle2' });

    const product = await page.evaluate(() => {
      const name = document.querySelector('.product-title')?.textContent.trim();
      const price = document.querySelector('.price-item--sale')?.textContent.trim() || document.querySelector('.price-item--regular')?.textContent.trim();
      const description = document.querySelector('.product__description')?.textContent.trim();
      const available = !document.querySelector('.so.icn')?.textContent.includes('SOLD OUT');
      const imageElements = document.querySelectorAll('.prod-image img');
      const images = Array.from(imageElements).map(img => img.getAttribute('src'));

      return { name, price, description, available, images };
    });

    products.push(product);
  }

  console.log(products);

  await browser.close();
})();