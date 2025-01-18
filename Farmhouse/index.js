const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = 'https://www.toasttab.com/catering/farmshop-santa-monica-225-26th-street';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Wait for menu items to load
  await page.waitForSelector('[data-testid="menu-item"]', { timeout: 60000 });

  // Extracting data from the page
  const products = await page.evaluate(() => {
    const productNodes = document.querySelectorAll('[data-testid="menu-item"]');
    const data = [];

    productNodes.forEach((product) => {
      const imgElement = product.querySelector('meta[itemprop="image"]');
      const priceElement = product.querySelector('[data-testid="menu-item-price"] .type-default');
      const descriptionElement = product.querySelector('[data-testid="menu-item-description"]');
      const nameElement = product.querySelector('[data-testid="menu-item-name"]');
      const contentUrlElement = product.querySelector('a[data-testid="menu-item-link"]');
      
      const image_url = imgElement ? imgElement.content : null;
      const retail_price = priceElement ? priceElement.textContent.trim() : null;
      const description = descriptionElement ? descriptionElement.textContent.trim() : null;
      const name = nameElement ? nameElement.textContent.trim() : null;
      const content_url = contentUrlElement ? contentUrlElement.href : null;
      
      data.push({ name, image_url, retail_price, description, content_url });
    });
    return data;
  });

  // Save data to JSON file
  fs.writeFileSync('menu_data.json', JSON.stringify(products, null, 2));

  console.log('Data has been saved to menu_data.json');

  await browser.close();
})();
