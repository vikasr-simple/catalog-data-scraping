const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://laespanolameats.com/kitchenware/ham-stand-knives/', { waitUntil: 'networkidle2' });

  // Extract product URLs
  const productUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.thumbnail.product-thumbnail')).map((a) => a.href);
  });
  console.log(productUrls);
  

  console.log(`Found ${productUrls.length} products.`);

  // Store product details
  const products = [];

  for (const url of productUrls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

//       // Extract product details
//       const product = await page.evaluate(() => {
//         const title = document.querySelector('h1.page-title span')?.innerText.trim() || 'N/A';
//         const price = document.querySelector('.current-price .product-price')?.innerText.trim() || 'N/A';
//         const sku = document.querySelector('.product-reference span[itemprop="sku"]')?.innerText.trim() || 'N/A';
//         const availability = document.querySelector('#product-availability.badge-success')?.innerText.trim() || 'N/A';
//         const descriptionShort = document.querySelector('.product-description-short')?.innerText.trim() || 'N/A';
//         const description = document.querySelector('.product-description .rte-content')?.innerText.trim() || 'N/A';
//         const category = document.querySelector('.product-category-name')?.innerText.trim() || 'N/A';
//         const reviews = Array.from(document.querySelectorAll('.iqitreviews-review')).map(review => ({
//           title: review.querySelector('.title')?.innerText.trim() || 'N/A',
//           rating: review.querySelector('.rating meta[itemprop="ratingValue"]')?.content.trim() || 'N/A',
//           body: review.querySelector('.comment')?.innerText.trim() || 'N/A',
//           author: review.querySelector('.author span[itemprop="name"]')?.innerText.trim() || 'N/A',
//           date: review.querySelector('.author span[itemprop="datePublished"]')?.innerText.trim() || 'N/A',
//         }));
//         const ingredients = Array.from(document.querySelectorAll('.data-sheet .name')).find(dt => dt.innerText.includes('Ingredients:'))?.nextElementSibling?.innerText.trim() || 'N/A';
//         const weight = Array.from(document.querySelectorAll('.data-sheet .name')).find(dt => dt.innerText.includes('Weight'))?.nextElementSibling?.innerText.trim() || 'N/A';
//         const manufacturer = document.querySelector('.product-manufacturer a img')?.alt.trim() || 'N/A';
//         const images = Array.from(document.querySelectorAll('.product-images-large img')).map((img) => img.src) || [];

//         return {
//           title,
//           price,
//           sku,
//           availability,
//           descriptionShort,
//           description,
//           category,
//           weight,
//           ingredients,
//           manufacturer,
//           reviews,
//           images,
//         };
//       });

// Inside the page.evaluate function
const product = await page.evaluate(() => {
  const title = document.querySelector('h1.page-title span')?.innerText.trim() || 'N/A';
  
  // Regex to match size in the title (e.g., "750ml", "1L", "500g")
  const sizeRegex = /(\d+(\.\d+)?\s?(ml|g|kg|l))/i;
  const sizeMatch = title.match(sizeRegex);
  const size = sizeMatch ? sizeMatch[0] : 'N/A';

  const price = document.querySelector('.current-price .product-price')?.innerText.trim() || 'N/A';
  const sku = document.querySelector('.product-reference span[itemprop="sku"]')?.innerText.trim() || 'N/A';
  const availability = document.querySelector('#product-availability.badge-success')?.innerText.trim() || 'N/A';
  const descriptionShort = document.querySelector('.product-description-short')?.innerText.trim() || 'N/A';
  const description = document.querySelector('.product-description .rte-content')?.innerText.trim() || 'N/A';
  const category = document.querySelector('.product-category-name')?.innerText.trim() || 'N/A';
  const reviews = Array.from(document.querySelectorAll('.iqitreviews-review')).map(review => ({
    title: review.querySelector('.title')?.innerText.trim() || 'N/A',
    rating: review.querySelector('.rating meta[itemprop="ratingValue"]')?.content.trim() || 'N/A',
    body: review.querySelector('.comment')?.innerText.trim() || 'N/A',
    author: review.querySelector('.author span[itemprop="name"]')?.innerText.trim() || 'N/A',
    date: review.querySelector('.author span[itemprop="datePublished"]')?.innerText.trim() || 'N/A',
  }));
  const ingredients = Array.from(document.querySelectorAll('.data-sheet .name')).find(dt => dt.innerText.includes('Ingredients:'))?.nextElementSibling?.innerText.trim() || 'N/A';
  const weight = Array.from(document.querySelectorAll('.data-sheet .name')).find(dt => dt.innerText.includes('Weight'))?.nextElementSibling?.innerText.trim() || 'N/A';
  const manufacturer = document.querySelector('.product-manufacturer a img')?.alt.trim() || 'N/A';
  const images = Array.from(document.querySelectorAll('.product-images-large img')).map((img) => img.src) || [];

  return {
    title,
    size,  // Adding size as a separate field
    price,
    sku,
    availability,
    descriptionShort,
    description,
    category,
    weight,
    ingredients,
    manufacturer,
    reviews,
    images,
  };
});



      products.push({ url, ...product });
      console.log(`Extracted details for: ${product.title}`);
    } catch (error) {
      console.error(`Failed to extract data from ${url}: ${error.message}`);
    }
  }
 console.log(products.length);
 
  // Save to JSON file
  fs.writeFileSync('knives.json', JSON.stringify(products, null, 2));

  console.log('Product details have been saved to products.json');

  await browser.close();
})();
