// const fs = require('fs');
// const { parse } = require('json2csv');

// // Import JSON data
// const jsonData = require('./UsFoods/oils-shortening_usFood_formatted.json')

// function jsonToCSV(jsonData) {
//    const items = Array.isArray(jsonData) ? jsonData : jsonData.data?.products?.items || jsonData;// Accessing the items array within the JSON structure

//   // Define headers for the main CSV columns
//   const fields = [
//     "description", "sku", "pack", "size", "gtin", "name", "retail_price","is_catch_weight","average_case_weight", "image", "manufacturer_sku", "ordering_unit","is_broken_case","content_url",
//     "brand", "level _1", "level_2", "level_3", "manufacturer_name",
//     "distributor_name", "unitPrice", "extra_data"
//   ];

//   const data = items.map((product) => {
//     const imageUrl = product["image_url-src"] || "";
//     const contentUrl = product["links-href"] || "";
//     // Extracting the category levels, assuming up to 4 levels in the hierarchy
//     // const categoryLevels = product.category_hierarchy || [];
//     // const categoryLevel1 = categoryLevels[0]?.name || "";
//     // const categoryLevel2 = categoryLevels[1]?.name || "";
//     // const categoryLevel3 = categoryLevels[2]?.name || "";
//     // const categoryLevel4 = categoryLevels[3]?.name || "";

//     // Extracting the first image URL from primary_image_meta, if available
//     // const baseUrl = "https://www.traderjoes.com";
//     // const imageUrl = product.primary_image_meta?.url ? `${baseUrl}${product.primary_image_meta.url}` : "";

//     // const size = product.sales_size && product.sales_uom_description
//     //   ? `${product.sales_size} ${product.sales_uom_description}`
//     //   : product.sales_size || product.sales_uom_description || "";

//     // Collecting additional data for `extra_data` field
//     // const extraData = {};
//     // Object.keys(product).forEach(key => {
//     //   if (!fields.includes(key) && key !== 'primary_image_meta' && key !== 'category_hierarchy') {
//     //     extraData[key] = product[key];
//     //   }
//     // });
//    const extraData = {
//       ...Object.keys(product).reduce((acc, key) => {
//         if (!fields.includes(key) && key !== "primary_image_meta" && key !== "category_hierarchy") {
//           acc[key] = product[key];
//         }
//         return acc;
//       }, {}),
//       features: product.features || "",
//       benefits: product.benefits || ""
//     };


//     return {
//       "description": product.description || "",
//       "sku": product.sku || "",
//       "pack": product.pack || "",
//       "size": product.size || "",
//       "gtin": "",
//       "name": product.Name || "",
//       "retail_price": product.retail_price || "",
//       "is_catch_weight": "",
//       "average_case_weight ": "",
//       "image": imageUrl ||"",
//       "manufacturer_sku": "",
//       "ordering_unit": "",
//       "is_broken_case": "",
//       "content_url": contentUrl ||"",
//       "brand" : product.brand ||"",
//       "level_1": "",
//       "level_2": "",
//       "level_3": "",
//       "manufacturer_name": "",
//       "distributor_name": "",
//       "unit_price":"",
//       "extra_data": JSON.stringify(extraData)  // Convert extra data to JSON string
//     };
//   });

//   // Convert JSON array to CSV string
//   return parse(data, { fields });
// }

// // Function to save CSV to a file
// function saveCSV(csvString, filename) {
//   fs.writeFileSync(filename, csvString, 'utf8');
//   console.log(`CSV file saved as ${filename}`);
// }

// // Convert JSON to CSV and save
// const csvString = jsonToCSV(jsonData);
// saveCSV(csvString, 'oils-shorteningcsv');

const fs = require('fs');
const { parse } = require('json2csv');

// Import JSON data
const jsonData = require('./Bakery.json');

function jsonToCSV(jsonData) {
  const items = Array.isArray(jsonData) ? jsonData : jsonData.data?.products?.items || jsonData;

  // Define headers for the main CSV columns
  const fields = [
    "description", "sku", "pack", "size", "gtin", "name", "retail_price",
    "is_catch_weight", "average_case_weight", "image", "manufacturer_sku",
    "ordering_unit", "is_broken_case", "content_url", "brand", "level_1", 
    "level_2", "level_3", "manufacturer_name", "distributor_name", "unit_price", 
    "extra_data"
  ];

  const data = items.map((product) => {
    const baseUrl = "https://www.traderjoes.com";
    const imageUrl = product.primary_image
      ? `${baseUrl}${product.primary_image}`
      : product.primary_image_meta?.url
      ? `${baseUrl}${product.primary_image_meta.url}`
      : "";
    
    // Construct the content URL using the provided format
    const contentUrl = `https://www.traderjoes.com/home/products/pdp/${product.item_title?.replace(/\s+/g, '-').toLowerCase()}-${product.sku}`;

    // Collecting additional data for `extra_data` field
    const extraData = {
      ...Object.keys(product).reduce((acc, key) => {
        if (!fields.includes(key) && key !== 'product_variants') {
          acc[key] = product[key];
        }
        return acc;
      }, {}),
      dietaryTags: product.dietaryTags || "",
      product_variants: product.product_variants || []
    };

    return {
      description: product.description || "",
      name: product.item_title || "",
      sku: product.sku || "",
      pack: product.pack || "",
      size: product.size || "",
      gtin: product.gtin || "",
      retail_price: product.retail_price || "",
      is_catch_weight: product.is_catch_weight || "",
      average_case_weight: product.average_case_weight || "",
      image: imageUrl,
      manufacturer_sku: product.manufacturer_sku || "",
      ordering_unit: product.ordering_unit || "",
      is_broken_case: product.is_broken_case || "",
      content_url: contentUrl,
      brand: product.brand || "",
      level_1: product["Level 1 category"] || "",
      level_2: product["Level 2 category"] || "",
      level_3: product["Level 3 category"] || "",
      manufacturer_name: product.manufacturer_name || "",
      distributor_name: product.distributor_name || "",
      unit_price: product.unit_price || "",
      extra_data: JSON.stringify(extraData) // Convert extra data to JSON string
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
saveCSV(csvString, 'WineBeerLiquour.csv');

