const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = 'https://www.drinkrevelwine.com/collections/all';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Improved Auto-Scroll Function
  const autoScroll = async (page) => {
    try {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          const distance = 100;
          const scrollDelay = 100; // Milliseconds delay for smooth scrolling
          const maxTries = 10; // Maximum scroll attempts if no new content is loaded
          let tries = 0;

          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;

            // Check if the page has stopped expanding
            const newHeight = document.body.scrollHeight;
            if (totalHeight >= newHeight || tries >= maxTries) {
              clearInterval(timer);
              resolve();
            }
            tries++;
          }, scrollDelay);
        });
      });
    } catch (error) {
      console.error('Error during autoScroll:', error);
    }
  };

  await autoScroll(page);

  // Extract all product URLs
  const productUrls = await page.evaluate(() => {
    try {
      return Array.from(document.querySelectorAll('.product-item a')).map(link => link.href);
    } catch (error) {
      console.error('Error extracting product URLs:', error);
      return [];
    }
  });

  if (productUrls.length === 0) {
    console.error('No products found. Please verify the page structure.');
    await browser.close();
    return;
  }

  console.log(`Found ${productUrls.length} products.`);

  const productDetails = [];

  // Function to extract product details
  const extractDetails = async (productPage) => {
    try {
      return await productPage.evaluate(() => {
        const title = document.querySelector('.product-single__title')?.innerText.trim() || '';
        const price = document.querySelector('.price__regular .price-item')?.innerText.trim() || '';
        const vendor = document.querySelector('.price__vendor dd')?.innerText.trim() || '';
        const description = document.querySelector('.product-single__description')?.innerText.trim() || '';
        const images = Array.from(document.querySelectorAll('.product-single__media img')).map(img => img.src);
        const techDetails = document.querySelector('#tab-1')?.innerText.trim() || '';
        const tastingNotes = document.querySelector('#tab-2')?.innerText.trim() || '';
        const winemaking = document.querySelector('#tab-3')?.innerText.trim() || '';
        const vineyard = document.querySelector('#tab-4')?.innerText.trim() || '';

        return {
          title,
          price,
          vendor,
          description,
          images,
          techDetails,
          tastingNotes,
          winemaking,
          vineyard,
        };
      });
    } catch (error) {
      console.error('Error extracting product details:', error);
      return {};
    }
  };

  // Visit each product URL and scrape details
  for (let i = 0; i < productUrls.length; i++) {
    const productUrl = productUrls[i];
    console.log(`Scraping product ${i + 1}/${productUrls.length}: ${productUrl}`);

    try {
      const productPage = await browser.newPage();
      await productPage.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

      const details = await extractDetails(productPage);
      productDetails.push({ url: productUrl, ...details });

      console.log(`Scraped details for product ${i + 1}`);
      await productPage.close();
    } catch (error) {
      console.error(`Error scraping product ${i + 1}: ${productUrl}`, error);
    }
  }

  // Save product details to a JSON file
  fs.writeFileSync('productDetails.json', JSON.stringify(productDetails, null, 2));
  console.log('Product details saved to productDetails.json.');

  await browser.close();
})();
