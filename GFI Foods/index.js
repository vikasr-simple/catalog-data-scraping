const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const baseUrl = 'https://www.gfifoods.com/bakery?p=1';
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });

    // Click "Load More" button until all products are loaded
    async function loadAllProducts() {
        let retries = 0;
        while (true) {
            try {
                // Check if "Load More" button is visible
                await page.waitForSelector('.amscroll-load-button', { visible: true, timeout: 5000 });
                await page.click('.amscroll-load-button');
                await page.waitForTimeout(5000); // Wait for more products to load
                retries = 0; // Reset retries after a successful click
            } catch (error) {
                // Retry a few times before giving up
                if (retries < 3) {
                    console.log(`Retrying... Attempt ${retries + 1}`);
                    retries++;
                } else {
                    // If button is not found, break the loop
                    console.log("All products loaded or no more load button visible.");
                    break;
                }
            }
        }

        // Wait for the "Load More" button to disappear entirely
        try {
            await page.waitForSelector('.amscroll-load-button', { hidden: true, timeout: 10000 });
        } catch (error) {
            console.log("Load More button not found anymore. Proceeding with scraping...");
        }
    }

    await loadAllProducts();

    // Get URLs of all product details pages after ensuring all products are loaded
    const productUrls = await page.$$eval('.product-item a', links => links.map(link => link.href));

    const productsData = [];

    // Function to write data to JSON file progressively
    const writeDataToFile = (data) => {
        fs.writeFileSync('gfiFoodsProducts.json', JSON.stringify(data, null, 2));
    };

    // Visit each product URL and scrape details
    for (let url of productUrls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });

            const productData = await page.evaluate(() => {
                const title = document.querySelector('.page-title .base')?.innerText || 'No Title Available';
                const brand = document.querySelector('.pdp-brand-name')?.innerText.replace('Brand: ', '').trim() || 'No Brand Available';
                const packSize = document.querySelector('.pdp-pack-size')?.innerText.replace('Pack Size: ', '').trim() || 'No Pack Size Available';
                const itemNumber = document.querySelector('.pdp-item-number')?.innerText.replace('GFI Item #: ', '').trim() || 'No Item Number Available';
                const description = document.querySelector('.product.attribute.overview .value')?.innerText.trim() || 'No Description Available';
                const sku = document.querySelector('#product-attribute-specs-table [data-th="SKU"]')?.innerText.trim() || 'No SKU Available';
                const packageType = document.querySelector('#product-attribute-specs-table [data-th="Package Type"]')?.innerText.trim() || 'No Package Type Available';
                const ingredients = document.querySelector('#product-attribute-specs-table [data-th="Ingredients"]')?.innerText.trim() || 'No Ingredients Available';
                const unitSize = document.querySelector('#product-attribute-specs-table [data-th="Unit Size"]')?.innerText.trim() || 'No Unit Size Available';
                const imageUrl = document.querySelector('.product.media .fotorama__img')?.src || 'No Image Available';
            
                const nutritionalInfo = Array.from(document.querySelectorAll('.nutritional-facts-main .block-two .parent')).map(el => {
                    const title = el.querySelector('.line-title')?.innerText.trim() || '';
                    const amount = el.querySelector('.line:not(.line-title)')?.innerText.trim() || '';
                    const dailyValue = el.querySelector('.line-right')?.innerText.trim() || '';
                    return { title, amount, dailyValue };
                });
            
                const additionalAttributes = Array.from(document.querySelectorAll('#product-attribute-specs-table tbody tr')).map(row => {
                    const label = row.querySelector('th')?.innerText.trim() || '';
                    const value = row.querySelector('td')?.innerText.trim() || '';
                    return { label, value };
                });
            
                return {
                    title,
                    brand,
                    packSize,
                    itemNumber,
                    description,
                    sku,
                    packageType,
                    ingredients,
                    unitSize,
                    imageUrl,
                    nutritionalInfo,
                    additionalAttributes
                };
            });
            productsData.push(productData);
            writeDataToFile(productsData);
            console.log(`Product ${productsData.length} scraped successfully.`);
        } catch (err) {
            console.error(`Error scraping product at ${url}: ${err.message}`);
            continue; // Continue with the next product if an error occurs
        }
    }

    await browser.close();
    console.log('Scraping completed and data saved to gfiFoodsProducts.json');
})();
