const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  console.log('Browser launched.');

  const page = await browser.newPage();
  console.log('New page opened.');

  const productsData = [];

  try {
    console.log('Navigating to Ace Hardware planters page...');
    await page.goto('https://www.acehardware.com/departments/automotive-rv-and-marine/towing-and-lifting', {
      waitUntil: 'networkidle2',
      timeout: 60000, // Set to 60 seconds
    });
    console.log('Page loaded.');

    let loadMoreVisible = true;

    // Loop to click "Load More" and load all products
    while (loadMoreVisible) {
      try {
        // Check if "Load More" button is visible
        loadMoreVisible = await page.$('#loadMoreBtn') !== null;

        if (loadMoreVisible) {
          console.log('Clicking "Load More" button...');
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
            page.click('#loadMoreBtn')
          ]);
          // Adding a delay for the new products to load completely
          await new Promise(resolve => setTimeout(resolve, 5000));

          // Log the current progress based on the "Showing X of Y" text
          const progressText = await page.evaluate(() => {
            return document.querySelector('.load-more-count')?.innerText || '';
          });
          console.log(`Progress: ${progressText}`);

          // Check if all products are loaded (if the "Showing" text indicates everything is loaded)
          const [shown, total] = progressText.match(/\d+/g).map(Number);
          if (shown >= total) {
            loadMoreVisible = false;
          }
        }
      } catch (error) {
        console.log('Error occurred while clicking "Load More" button:', error.message);
        loadMoreVisible = false;
      }
    }

    console.log('All products loaded.');

    // Step 2: Collect all product links from the page
    console.log('Collecting product links...');
    const productLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('li.col-md-4.col-xs-6.mz-productlist-item a.mz-productlisting-title').forEach((link) => {
        links.push(link.href);
      });
      return links;
    });
    console.log(`Collected ${productLinks.length} product links.`);

    // Step 3: Visit each product link to extract data
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i];
      console.log(`Processing product ${i + 1} of ${productLinks.length}: ${link}`);

      let retries = 3;
      while (retries > 0) {
        try {
          console.log(`Navigating to product page: ${link}`);
          await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
          console.log('Product page loaded.');

          // Adding a small delay to ensure all content is loaded properly
          await new Promise(resolve => setTimeout(resolve, 2000));

          console.log('Extracting product data...');
          const productData = await page.evaluate(() => {
            const container = document.querySelector('div.mz-l-pagecontent.container');
            if (!container) return {};

            const title = container.querySelector('h1.mz-pagetitle')?.innerText || 'N/A';
            const price = container.querySelector('div.price')?.innerText || 'N/A';
            const sku = container.querySelector('div.productCode')?.innerText || 'N/A';
            const images = Array.from(container.querySelectorAll('.swiper-slide img')).map((img) => img.src) || [];

            // Update selectors for better accuracy
            const productOverview = container.querySelector('div#product-overview .description-container')?.innerText || 'N/A';
            const specifications = Array.from(container.querySelectorAll('div#specifications ul li')).map((spec) => spec.innerText) || [];

            // Find the brand and mfr from specifications
            const brandName = specifications.find((spec) => spec.toLowerCase().includes('brand name'))?.split(':')[1].trim() || 'N/A';
            const mfr = container.querySelector('div.mfrCode')?.innerText || '';

            return {
              title,
              price,
              sku,
              images,
              productOverview,
              specifications,
              brandName,
              mfr,
            };
          });

          productsData.push({ content_url: link, ...productData });
          console.log('Extracted product details:', productData);

          // Save data in batches to prevent data loss
          fs.writeFileSync('TowingandLifting.json', JSON.stringify(productsData, null, 2));
          console.log('Data saved to TowingandLifting.json.');

          break; // Exit retry loop on success
        } catch (error) {
          console.error(`Error extracting data from ${link}:`, error);
          retries -= 1;
          console.log(`Retries left: ${retries}`);
          if (retries === 0) {
            console.error(`Failed to extract data from ${link} after multiple attempts.`);
          }
        }
      }
    }

  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
  } finally {
    await browser.close();
    console.log('Browser closed. Scraping completed.');
  }
})();

