
// const puppeteer = require('puppeteer');
// const fs = require('fs');

// (async () => {
//   const url = 'https://net3.necs.com/orlandoimports/site/catalog/95+STORAGE'; // Target page URL

//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   try {
//     console.log("Navigating to target page...");
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Function to extract product details for all products on the page with raw logging
//     const extractProducts = async () => {
//       console.log("Extracting products from the page...");
//       const products = await page.evaluate(() => {
//         // Using a more general selector if the structure is unknown or inconsistent
//         const productElements = Array.from(document.querySelectorAll('div, section, article')); // Adjust for broader capture

//         if (!productElements.length) {
//           console.log("No product elements found. Check selectors.");
//         }

//         return productElements
//           .map(product => {
//             const name = product.querySelector('h3, .product-name, .title')?.innerText.trim() || null;
//             const brand = product.querySelector('.brand, .product-brand, .brand-name')?.innerText.trim() || 'Unknown'; // Adjust as necessary
//             const packSize = product.querySelector('.pack-size, .product-pack-size, .size')?.innerText.trim() || null; // Adjust as necessary
//             const unit = product.querySelector('.unit, .product-unit')?.innerText.trim() || null; // Adjust as necessary
//             const itemNumber = product.querySelector('.item-number, .product-item-number')?.innerText.trim() || null; // Adjust as necessary
//             const category = document.querySelector('.breadcrumb a:last-child')?.innerText.trim() || 'Unknown';
//             const itemCode = Array.from(product.querySelectorAll('span, p')).find(span => span.innerText.includes('Code'))?.innerText.replace('Code:', '').trim() || null;
//             const upc = Array.from(product.querySelectorAll('span, p')).find(span => span.innerText.includes('UPC'))?.innerText.replace('UPC:', '').trim() || null;
//             const imageUrl = product.querySelector('img')?.src || null;
//             const availability = product.innerText.includes('Out of stock') ? 'Out of stock' : 'Available';
//             if (name) {
//               console.log(`Found product: ${name}`);
//               return {
//                 name,
//                 category,
//                 itemCode,
//                 upc,
//                 imageUrl,
//                 availability,
//               };
//             }
//             return null;
//           })
//           .filter(Boolean);
//       });

//       console.log(`Extracted ${products.length} products.`);
//       return products;
//     };

//     // Collect products from the page
//     let allProducts = await extractProducts();

//     // Log extracted products to verify content before filtering
//     console.log("Products extracted (before filtering):", allProducts);

//     // Remove duplicates based on 'name' and 'itemCode' combination
//     const uniqueProducts = Array.from(
//       new Map(allProducts.map(product => [`${product.name}-${product.itemCode}`, product])).values()
//     );

//     console.log(`Filtered to ${uniqueProducts.length} unique products.`);

//     // Save the unique data to a JSON file
//     console.log("Saving collected data to products.json...");
//     fs.writeFileSync('products.json', JSON.stringify(uniqueProducts, null, 2), 'utf-8');
//     console.log('Data has been saved to products.json');

//   } catch (error) {
//     console.error("An error occurred during the process:", error);
//   } finally {
//     console.log("Closing browser...");
//     await browser.close();
//   }
// })();
import axios from 'axios';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // For generating unique correlation IDs

const API_URL = 'https://panamax-api.ama.usfoods.com/product-domain-api/v1/search?worksWellWith=true';
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyIjp7InVzZXJOYW1lIjoiR1VFU1RVU0VSIiwidXNlcklkIjoxMzA3NDc0MiwiaXBBZGRyZXNzIjoiIn0sInNjb3BlcyI6WyJ1c2YtdXNlciIsInVzZi1jdXN0b21lciIsInVzZi1wcm9kdWN0Il0sInVzZi1jbGFpbXMiOnsiZGl2aXNpb25OdW1iZXIiOjIyNTAsImN1c3RvbWVyTnVtYmVyIjo2MTY4MTcwNiwiZGVwYXJ0bWVudE51bWJlciI6MCwidXNlck5hbWUiOiJHVUVTVFVTRVIiLCJ1c2VySWQiOjEzMDc0NzQyLCJvcmRlclRha2VyUm9sZSI6bnVsbCwib3JkZXJUYWtlcklkIjpudWxsLCJvcmRlclRha2VyU291cmNlIjpudWxsLCJ1c2VyVHlwZSI6Imd1ZXN0IiwicmVxdWlyZUN1c3RvbWVyUE8iOm51bGwsImNsaWVudElkIjpudWxsLCJjbGllbnRDb25jZXB0IjpudWxsLCJoYXNJbnZlbnRvcnkiOmZhbHNlLCJjdXN0b21lclR5cGUiOiJTVCIsIm9nUHJpbnRQcmljZUluZCI6Ik4iLCJyZXN0cmljdFRvT0ciOiJOIiwiZGlyZWN0RWxpZ2libGUiOnRydWUsImVtYWlsIjoidml2aWFuZS5yYWd1c29AdXNmb29kcy5jb20iLCJhbGxvd0ltcGVyc29uYXRpb24iOmZhbHNlLCJ0bVVzZXIiOiJOIiwicjRSZWRpcmVjdCI6IlkiLCJoaWRlSW52ZW50b3J5IjoiWSIsImRpc3BsYXlEd29TdGF0dXMiOmZhbHNlLCJoaWRlU3VwcGxpZXJVbmF2YWlsYWJsZSI6ZmFsc2UsImhpZGVPdXRPZlN0b2NrIjpmYWxzZSwicmVzdHJpY3RNTE1DYXRhbG9nU2VhcmNoIjpmYWxzZSwiZWNvbVVzZXJUeXBlIjoiMSIsImlzU3VwZXJVc2VyIjpmYWxzZSwiaXNHdWVzdFVzZXIiOnRydWUsIm1zbFJlc3RyaWN0aW9uT3ZlcnJpZGUiOmZhbHNlLCJwdW5jaHRocnVTZXNzaW9uIjpmYWxzZSwibWVzc2FnaW5nQWRtaW4iOmZhbHNlLCJzZXJ2aWNlQWNjb3VudCI6ZmFsc2UsInB1bmNob3V0U2Vzc2lvbiI6ZmFsc2UsImludGVncmF0aW9uU2Vzc2lvbiI6ZmFsc2UsInRlcm1zT2ZVc2VBY2NlcHRlZCI6dHJ1ZSwicGF5SW52b2ljZVVzZXIiOmZhbHNlLCJ0cmVuZHZpZXczNjBVc2VyIjpmYWxzZSwibG9hZFJlY2VudGx5UHVyY2hhc2VkSW5PRyI6IlkifSwiaWF0IjoxNzM3NDQwOTM0LCJleHAiOjE3Mzc1MjczMzR9.MCbVCNiy9rou8hW9pDl7xfgYlVJCha6yYZWvsv3CD9QI5U-BIyTiX4ZY7C6MvkXHVTyEauyRk2I_WaPDS1X12AZsb3kpLGPWbkGb5K4v5qy5FzTAUGSHU63u-yQ-957pf2h5crh_wCWG5bsU9hLXUFEwUfrnSaiKnHnXQ6cNfku2LZVn1dKgFeBwH-mGdXAcRhCtNMisXd-oqDkhMhG8GxH7kawD0IsO8IvmJvURjd7JAC-v56RI_RuE-oBv5VfqI1HzA1SLbsXMrEDAMYp2MFAA5VTtPEg81M4pjhOFAjkjpQtNDGHioQXYaVaZCcUQEYFj-sI32rM3Mn1R3JaQqQ'; // Replace with your actual token
const CONSUMER_ID = 'ecom'; // Replace with the required consumer ID

async function fetchPaginatedProducts() {
  let offset = 0;
  const recordsPerPage = 50; // Number of records per page
  const totalRecords = 908; // Total number of products
  let allProducts = [];

  console.log('Starting product scraping with pagination...');

  try {
    while (offset < totalRecords) {
      console.log(`Fetching products with offset: ${offset}, recordsPerPage: ${recordsPerPage}...`);

      const payload = {
        dimensionId: "0",
        pageType: "all",
        ts: "66971",
        recordsPerPage,
        categoryId: "20",
        searchFilterProperties: "20",
        searchFilterSelected: "[object Object]",
        searchToggle: "",
        excludeProductNumbers: [],
        offset, // Pagination offset
        customization: "Default",
        appType: "web",
        source: "r4_desktop",
      };

      const headers = {
        'accept': 'application/json, text/plain, */*',
        'authorization': `Bearer ${AUTH_TOKEN}`,
        'content-type': 'application/json',
        'consumer-id': CONSUMER_ID,
        'correlation-id': uuidv4(), // Generates a unique correlation ID
        'origin': 'https://order.usfoods.com',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
      };

      try {
        console.log("Payload:", payload);
        console.log("Headers:", headers);

        const response = await axios.post(API_URL, payload, { headers });

        const products = response.data.productContracts || [];
        console.log("Response Data:", response.data);

        if (products.length === 0) {
          console.log("No products found in this batch.");
          break;
        }

        console.log(`Fetched ${products.length} products from offset: ${offset}.`);
        allProducts = [...allProducts, ...products];
        offset += recordsPerPage; // Move to the next batch
      } catch (error) {
        console.error(`Error fetching products at offset ${offset}:`, error.message);
        console.error('Response:', error.response?.data || 'No additional details');
        break; // Stop the loop if an error occurs
      }
    }

    // Save all products to a JSON file
    if (allProducts.length > 0) {
      fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 2), 'utf8');
      console.log(`Scraping completed. Total products scraped: ${allProducts.length}. Data saved to products.json.`);
    } else {
      console.log("No products scraped. Please verify the request details.");
    }
  } catch (error) {
    console.error('Error during scraping:', error.message);
  }
}

fetchPaginatedProducts();

