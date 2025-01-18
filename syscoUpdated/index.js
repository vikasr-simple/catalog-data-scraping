import fs from 'fs';
import { parse } from 'json2csv';

// Import JSON data
import jsonData from './Canned___Dry_by_Ai.json' assert { type: 'json' };

function jsonToCSV(jsonArray) {
  // Define headers for the main CSV columns
  const fields = [
    "sku", "pack", "size", "gtin", "name", "retail_price", "content_url","image_url",
    "brand", "level 1", "level 2", "level 3", "manufacturer_name",
    "distributor_name", "unitPrice", "extra_data"
  ];

  const data = jsonArray.map((product) => {
    // Extracting the first image URL without brackets or quotes
    const imageUrl = product.image_url
      ? product.image_url.replace(/[\[\]"]/g, '').split(',')[0]
      : "";

    // Collecting additional data for `extra_data` field
    const extraData = {};
    Object.keys(product).forEach(key => {
      if (!fields.includes(key) && key !== 'image_url') {
        extraData[key] = product[key];
      }
    });

    return {
      "sku": product?.sku || "",
      "pack": product?.pack || "",
      "size": product?.size || "",
      "gtin": product?.gtin || "",
      "name": product?.prioduct_name|| "",
      "retail_price": product?.retail_price || "",
      "content_url": product?.content_url || "",
      "image_url": imageUrl,  // Use processed image URL
      "brand": product?.brand || "",
      "level 1": product?.['Level 1 category'] || "",
      "level 2": product?.['Level 2 category'] || "",
      "level 3": product?.['Level 3 category'] || "",
      "manufacturer_name": product?.manufacturer_name || "",
      "distributor_name": product?.distributor_name || "",
      "unitPrice": product?.unitPrice || "",
      "extra_data": JSON.stringify(extraData)  // Convert extra data to JSON string
    };
  });

  // Convert JSON array to CSV string
  return parse(data, { fields });
}

// Function to save CSV to a file
function saveCSV(csvString, filename) {
  fs.writeFileSync(filename, csvString, 'utf8');
  console.log(`CSV file saved as ${filename}`);
}

// Convert JSON to CSV and save
const csvString = jsonToCSV(jsonData);
saveCSV(csvString, 'Canned___Dry.csv');
