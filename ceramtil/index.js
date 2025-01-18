const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to the main page
  await page.goto('https://www.cremaartisan.com/pickup-delivery', {
    waitUntil: 'networkidle2',
  });

  // Extract all product links
  const productLinks = await page.evaluate(() => {
    const productElements = document.querySelectorAll('.grid-item a.grid-item-link');
    return Array.from(productElements).map((element) => element.getAttribute('href'));
  });

  // Prefix the base URL to the links
  const baseUrl = 'https://www.cremaartisan.com';
  const fullProductLinks = productLinks.map((link) => `${baseUrl}${link}`);

  // Array to hold product details
  const products = [];

  // Loop through each product URL and extract information
  for (const link of fullProductLinks) {
    await page.goto(link, { waitUntil: 'networkidle2' });

    const productDetails = await page.evaluate(() => {
      // Extract product name
      const nameElement = document.querySelector('.ProductItem-details-title');
      const name = nameElement ? nameElement.innerText.trim() : null;

      // Extract product image URL
      const imageElement = document.querySelector('.ProductItem-gallery-slides-item-image');
      const imageUrl = imageElement ? imageElement.src : null;

      // Extract product price
      const priceElement = document.querySelector('.product-price');
      const price = priceElement ? priceElement.innerText.trim() : null;

      // Extract product description
      const descriptionElement = document.querySelector('.ProductItem-details-excerpt');
      const description = descriptionElement ? descriptionElement.innerText.trim() : null;

      // Extract product ingredients
      const ingredientsElement = document.querySelector('.ProductItem-details-excerpt-below-price');
      const ingredients = ingredientsElement ? ingredientsElement.innerText.trim() : null;

      return {
        name,
        imageUrl,
        price,
        description,
        ingredients,
      };
    });

    // Add the content URL to the product details
    productDetails.content_url = link;

    // Add the extracted product details to the array
    products.push(productDetails);
  }

  // Save the extracted product details to a JSON file
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

  // Output a success message
  console.log('Product details have been saved to products.json');

  // Close the browser
  await browser.close();
})();
