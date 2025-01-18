const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // URL of the product page
    const productPageUrl = 'https://www.drinkrevelwine.com/products/aaron-burr-2021-homestead-cider-neversink-highlands-500ml';
    await page.goto(productPageUrl, { waitUntil: 'networkidle2' });

    try {
        // Extract product details
        const productDetails = await page.evaluate(() => {
            const getText = (selector) => document.querySelector(selector)?.innerText?.trim() || '';
            const getImage = (selector) => document.querySelector(selector)?.src || '';

            const title = getText('h1.product-single__title');
            const price = getText('.price-item--regular') || getText('.price-item--sale');
            const vendor = getText('.price__vendor dd');
            const description = getText('.product-single__description span.pretext');
            const imageUrl = getImage('.product-single__media img');

            // Extract tabs content (Tech, Tasting Notes, etc.)
            const tabs = Array.from(document.querySelectorAll('.tabs li a')).map(tab => {
                const tabContentId = tab.getAttribute('href');
                const tabName = tab.innerText.trim();
                const tabContent = document.querySelector(tabContentId)?.innerText?.trim() || '';
                return { tabName, tabContent };
            });

            return {
                title,
                price,
                vendor,
                description,
                imageUrl,
                tabs,
            };
        });

        console.log('Extracted Product Details:', productDetails);

        // Save to a JSON file
        fs.writeFileSync('product_details.json', JSON.stringify(productDetails, null, 2));
        console.log('Product details saved to product_details.json');
    } catch (error) {
        console.error('Error while extracting product details:', error);
    } finally {
        await browser.close();
    }
})();
