const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.gfifoods.com/bakery?p=1.', { waitUntil: 'domcontentloaded' });

  // Wait for the page to load completely and ensure the "Load More" button is visible
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Function to click the "Load More" button until all products are loaded
  async function clickLoadMore() {
    let loadMoreVisible = true;
    while (loadMoreVisible) {
      try {
        await page.waitForSelector('button.amscroll-load-button', { visible: true, timeout: 10000 });
        await page.evaluate(() => {
          const loadMoreButton = document.querySelector('button.amscroll-load-button');
          if (loadMoreButton) {
            loadMoreButton.scrollIntoView();
          }
        });
        await page.waitForTimeout(1000); // Wait for the button to be scrolled into view
        await page.click('button.amscroll-load-button');
        console.log('Clicked Load More button');
        await page.waitForTimeout(5000); // Wait for products to load
      } catch (error) {
        loadMoreVisible = false;
        console.log('No more Load More button found');
      }
    }
  }

  // Click the "Load More" button until all products are visible
  await clickLoadMore();

  // Extract product links
  const productLinks = await page.$$eval('ol.products .product-item a.product-item-link', links =>
    links.map(link => link.href)
  );
  console.log(`Extracted ${productLinks.length} product links`);

  // Save product links to a file
  fs.writeFileSync('product_links.json', JSON.stringify(productLinks, null, 3));

  const allProductsData = [];

  // Visit each product link and extract data
  for (const [index, link] of productLinks.entries()) {
    console.log(`Visiting product ${index + 1} of ${productLinks.length}: ${link}`);
    await page.goto(link, { waitUntil: 'domcontentloaded' });

    // Wait for the image to be fully loaded
    await page.waitForSelector('.fotorama__stage__frame.fotorama__active img', { visible: true, timeout: 10000 });

    const productData = await page.evaluate(() => {
      const name = document.querySelector('.page-title-wrapper .base')?.textContent.trim() || 'N/A';
      const brand = document.querySelector('.pdp-brand-name')?.textContent.replace('Brand: ', '').trim() || 'N/A';
      const packSize = document.querySelector('.pdp-pack-size')?.textContent.replace('Pack Size: ', '').trim() || 'N/A';
      const itemNumber = document.querySelector('.pdp-item-number')?.textContent.replace('GFI Item #: ', '').trim() || 'N/A';
      const description = document.querySelector('.product.attribute.overview .value')?.textContent.trim() || 'N/A';
      const image = document.querySelector('.fotorama__stage__frame.fotorama__active img')?.getAttribute('src') || 'N/A';
      const contentUrl = window.location.href;
      return { name, brand, packSize, itemNumber, description, image, contentUrl };
    });

    console.log(`Extracted data for product: ${productData.name}`);
    allProductsData.push(productData);
  }

  // Save the extracted data to a JSON file
  fs.writeFileSync('yab.json', JSON.stringify(allProductsData, null, 5));

  console.log('Data extraction completed!');

  await browser.close();
})();
