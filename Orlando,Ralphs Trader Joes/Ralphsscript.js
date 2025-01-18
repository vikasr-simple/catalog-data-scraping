
const puppeteer = require('puppeteer'); // Switch from puppeteer-core to puppeteer for better compatibility

async function scrapeRalphsProductDetails() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-http2'] // Disable HTTP/2 protocol
  });

  const page = await browser.newPage();

  try {
    // Increase timeout to give more time for loading
    await page.goto('https://www.ralphs.com/p/kroger-original-sour-cream/0001111046070', {
      waitUntil: 'networkidle2',
      timeout: 60000 // Set a higher timeout
    });

    // Extract product details
    const productDetails = await page.evaluate(() => {
      const name = document.querySelector('.ProductDetails-header')?.innerText || '';
      const price = document.querySelector('[data-qa="cart-page-item-price"] mark')?.innerText || '';
      const rating = document.querySelector('[data-testid="rating_summary"] .kds-Text--m')?.innerText || '';
      const upc = document.querySelector('[data-testid="product-details-upc"]')?.innerText.replace('UPC: ', '') || '';
      const imageUrl = document.querySelector('[data-testid="main-image-container"] img')?.src || '';
      const locatedIn = document.querySelector('[data-testid="product-details-location"]')?.innerText || '';

      return { name, price, rating, upc, imageUrl, locatedIn };
    });

    console.log('Product Details:', productDetails);

    // Click to load more reviews until all are loaded
    const reviews = [];
    let loadMoreVisible = true;

    while (loadMoreVisible) {
      try {
        await page.click('[data-testid="view-more-reviews"]');
        await page.waitForTimeout(2000); // Adjust timeout based on loading speed
      } catch (error) {
        loadMoreVisible = false;
      }
    }

    // Extract review details
    const reviewsData = await page.evaluate(() => {
      const reviewElements = Array.from(document.querySelectorAll('[data-testid="reviews-tile"]'));

      return reviewElements.map(review => ({
        title: review.querySelector('.ReviewTile--header')?.innerText || '',
        date: review.querySelector('.kds-Text--s.text-neutral-less-prominent')?.innerText || '',
        content: review.querySelector('.ReviewTile--text-collapsed')?.innerText || '',
        rating: review.querySelectorAll('.kds-Icon--utilityExtraSmall.text-accent-more-prominent').length
      }));
    });

    reviews.push(...reviewsData);

    console.log('Reviews:', reviews);

    await browser.close();
    return { productDetails, reviews };
  } catch (error) {
    console.error('Error:', error);
    await browser.close();
  }
}

scrapeRalphsProductDetails().then(data => {
  const fs = require('fs');
  fs.writeFileSync('ralphs_product_data.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Data saved to ralphs_product_data.json');
});
