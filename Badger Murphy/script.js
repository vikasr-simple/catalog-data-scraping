
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Visible browser for debugging
    const page = await browser.newPage();

    // Increase navigation timeout
    page.setDefaultNavigationTimeout(60000); // 60 seconds

    // Base URL for pagination
    const baseUrl = 'https://www.badgermurphy.com/products/';
    const products = [];

    let currentPage = 1;
    let lastPage = 77; // Adjust based on total pages available

    try {
        while (currentPage <= lastPage) {
            console.log(`Scraping page ${currentPage}...`);

            const url = currentPage === 1 ? baseUrl : `${baseUrl}page/${currentPage}/?count=36&q=products%2F`;

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded' });
            } catch (error) {
                console.warn(`Failed to load page ${currentPage}, skipping...`);
                currentPage++;
                continue;
            }

            // Wait for product links to load
            try {
                await page.waitForSelector('.product-loop-title', { timeout: 20000 });
            } catch (error) {
                console.warn(`Product links not found on page ${currentPage}, skipping...`);
                currentPage++;
                continue;
            }

            // Extract product links
            const productLinks = await page.$$eval('.product-loop-title', links =>
                links.map(link => link.href)
            );

            for (const link of productLinks) {
                console.log(`Scraping product: ${link}`);

                let retries = 3; // Retry mechanism for product pages
                while (retries > 0) {
                    try {
                        await page.goto(link, { waitUntil: 'domcontentloaded' });
                        await page.waitForSelector('.product-fieldset', { timeout: 400000 });

                        const product = await page.evaluate(() => {
                            const getField = (label) => {
                                const fields = document.querySelectorAll('.product-fieldset p');
                                for (const field of fields) {
                                    const fieldLabel = field.querySelector('.field-label');
                                    const fieldValue = field.querySelector('.field-info, .product-list-field');
                                    if (fieldLabel && fieldLabel.innerText.trim().toLowerCase() === label.trim().toLowerCase()) {
                                        return fieldValue?.innerText.trim() || 'N/A';
                                    }
                                }
                                return 'N/A';
                            };

                            const name = document.querySelector('h1.page-title')?.innerText.trim() || 'N/A';
                            const sku = getField('ITEM NUMBER');
                            const brand = getField('BRAND NAME');
                            const pack = getField('PACK');
                            const size = getField('SIZE');
                            const unit = getField('UNIT TYPE');
                            const content_url = window.location.href;

                            return { name, sku, brand, pack, size, unit, content_url };
                        });

                        console.log(`Extracted product:`, product);

                        // Add the product to the JSON file immediately
                        products.push(product);
                        fs.writeFileSync('BadgerMurphy.json', JSON.stringify(products, null, 2));

                        break; // Exit retry loop on success
                    } catch (error) {
                        console.warn(`Failed to scrape product at ${link}, retries left: ${retries - 1}`);
                        retries--;
                        if (retries === 0) {
                            console.error(`Giving up on product: ${link}`);
                        }
                    }
                }
            }

            currentPage++;
        }

        console.log('Scraping completed. Data saved to BadgerMurphy.json.');
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        await browser.close();
        // Save progress even if interrupted
        fs.writeFileSync('BadgerMurphy.json', JSON.stringify(products, null, 2));
        console.log('Browser closed. Progress saved.');
    }
})();
