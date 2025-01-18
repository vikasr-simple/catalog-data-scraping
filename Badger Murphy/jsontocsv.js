// const fs = require('fs');
// const { parse } = require('json2csv');

// try {
//   // Load the JSON data
//   const jsonDataPath = './staples-Water-Bewerages.json'; // Update to match your JSON file path
//   if (!fs.existsSync(jsonDataPath)) {
//     throw new Error(`JSON file not found at path: ${jsonDataPath}`);
//   }

//   const jsonData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'));

//   function jsonToCSV(jsonData) {
//     const fields = [
//       'description',
//       'name',
//       'sku',
//       'pack',
//       'size',
//       'gtin',
//       'retail_price',
//       'is_catch_weight',
//       'average_case_weight',
//       'image',
//       'manufacturer_sku',
//       'ordering_unit',
//       'is_broken_case',
//       'content_url',
//       'brand',
//       'taxonomy',
//       'level 1',
//       'level 2',
//       'level 3',
//       'manufacturer_name',
//       'distributor_name',
//       'unit_price',
//       'extra_data',
//     ];

//     const distributorName = 'Staples';

//     // Create a set to track processed SKUs or URLs
//     const seenProducts = new Set();

//     // Flatten JSON data and prevent duplicates
//     const flattenedItems = jsonData.reduce((acc, item) => {
//       // Ensure unique products by checking the SKU or URL
//       const uniqueIdentifier = item.sku || item.url;
//       if (seenProducts.has(uniqueIdentifier)) {
//         return acc; // Skip duplicate product
//       }

//       seenProducts.add(uniqueIdentifier); // Mark as processed

//       // Generate content URL
//       const contentUrl = item.url || '';

//       // Collect extra data fields (we assume any field not in the CSV list is extra data)
//       const extraData = Object.keys(item).reduce((acc, key) => {
//         if (!fields.includes(key)) {
//           acc[key] = item[key];
//         }
//         return acc;
//       }, {});

//       // Map available fields to CSV and keep the rest empty
//       acc.push({
//         description: item.description || '', // Use description from the item if available
//         name: item.name || '',
//         sku: item.sku || '',
//         pack: '', // No explicit pack field in the sample JSON
//         size: item.size || '', // Size is available
//         gtin: '', // No explicit GTIN field
//         retail_price: item.price || '', // Price field in the JSON
//         is_catch_weight: '', // No explicit catch weight info
//         average_case_weight: '', // No explicit average case weight info
//         image: item.image_url || '', // Image URL field
//         manufacturer_sku: '', // No manufacturer SKU in the provided JSON
//         ordering_unit: '', // No ordering unit field
//         is_broken_case: '', // No broken case information
//         content_url: contentUrl, // Use the URL field for content URL
//         brand: '', // No brand field in the sample
//         taxonomy: '', // No taxonomy field
//         'level 1': '', // No explicit level 1 field
//         'level 2': '', // No explicit level 2 field
//         'level 3': '', // No explicit level 3 field
//         manufacturer_name: '', // No manufacturer name field
//         distributor_name: distributorName, // Always "Green Paper Products"
//         unit_price: '', // No unit price field
//         extra_data: JSON.stringify(extraData) || '', // Store extra data fields as a JSON string
//       });

//       return acc;
//     }, []);

//     // Return the CSV string using json2csv
//     return parse(flattenedItems, { fields, defaultValue: '' });
//   }

//   // Convert JSON to CSV
//   const csvString = jsonToCSV(jsonData);

//   // Save the CSV file
//   const outputFilePath = 'Staples-Water-Bewerages..csv'; // You can change the output filename
//   fs.writeFileSync(outputFilePath, csvString, 'utf8');
//   console.log(`CSV file saved as ${outputFilePath}`);
// } catch (error) {
//   console.error('Error processing the file:', error.message);
// }
const fs = require('fs');
const { parse } = require('json2csv');

// Define the new headers
const headers = [
  'description', 'name', 'sku', 'pack', 'size', 'gtin', 'retail_price', 'is_catch_weight',
  'average_case_weight', 'image', 'manufacturer_sku', 'ordering_unit', 'is_broken_case',
  'content_url', 'brand', 'taxonomy', 'level 1', 'level 2', 'level 3', 'manufacturer_name',
  'distributor_name', 'unit_price', 'extra_data'
];

try {
  // Load the JSON file
  const jsonData = JSON.parse(fs.readFileSync('./BadgerMurphy.json', 'utf8')); // Update with your JSON file path

  // Map the JSON data to the desired format
  const csvData = jsonData.map(item => ({
    description: item.description, // Add description if available
    name: item.name || "",
    sku: item.sku || "",
    pack: item.pack, // Leave blank for now
    size: item.size, // Leave blank for now
    gtin: "", // Leave blank for now
    retail_price: item.retail_price, // Leave blank for now
    is_catch_weight: "", // Leave blank for now
    average_case_weight: "", // Leave blank for now
    image: item.image || "",
    manufacturer_sku: "", // Leave blank for now
    ordering_unit: item.unit, // Leave blank for now
    is_broken_case: "", // Leave blank for now
    content_url: item.content_url,
    brand: item.brand ||"", // Leave blank for now
    taxonomy: "", // Leave blank for now
    "level 1":  "", // Leave blank for now
    "level 2": "", // Leave blank for now
    "level 3": "", // Leave blank for now
    manufacturer_name: "", // Leave blank for now
    distributor_name: "Badger Murphy",
    unit_price: "", // Leave blank for now
    extra_data: "" // Leave blank for now
  }));

  // Convert the mapped data to CSV
  const csv = parse(csvData, { fields: headers });

  // Write the CSV data to a file
  const outputFile = 'Badger Murphy.csv'; // Change to desired output file path
  fs.writeFileSync(outputFile, csv);

  console.log('CSV file has been successfully written!');

} catch (error) {
  console.error('Error processing the file:', error);
}

// const fs = require('fs');
// const { parse } = require('json2csv');

// // Define the new headers
// const headers = [
//   'description', 'name', 'sku', 'pack', 'size', 'gtin', 'retail_price', 'is_catch_weight',
//   'average_case_weight', 'image', 'manufacturer_sku', 'ordering_unit', 'is_broken_case',
//   'content_url', 'brand', 'taxonomy', 'level 1', 'level 2', 'level 3', 'manufacturer_name',
//   'distributor_name', 'unit_price', 'extra_data'
// ];

// try {
//   // Load the JSON file
//   const jsonData = JSON.parse(fs.readFileSync('./JFCsauce.json', 'utf8')); // Update with your JSON file path

//   // Map the JSON data to the desired format
//   const csvData = jsonData.map(item => {
//     // Extract `description` from `featuresAndBenefits.productDescriptor`
//     const description = item.extra_data?.data?.getProducts?.[0]?.productInfo?.featuresAndBenefits?.productDescriptor || item.description || "";

//     // Extract `level 2` from `taxonomy.itemGroup`
//     const level2 = item.extra_data?.data?.getProducts?.[0]?.productInfo?.taxonomy?.itemGroup || "";

//     // Collect remaining fields for `extra_data`
//     const extraData = { ...item };
//     delete extraData.description;
//     delete extraData.extra_data?.data?.getProducts?.[0]?.productInfo?.featuresAndBenefits?.productDescriptor;
//     delete extraData.extra_data?.data?.getProducts?.[0]?.productInfo?.taxonomy?.itemGroup;

//     return {
//       description,
//       name: item.name || "",
//       sku: item.sku || "",
//       pack: item.pack || "",
//       size: item.size || "",
//       gtin: item.gtin || "",
//       retail_price: item.retail_price || "",
//       is_catch_weight: item.is_catch_weight || "",
//       average_case_weight: item.average_case_weight || "",
//       image: item.image || "",
//       manufacturer_sku: item.manufacturer_sku || "",
//       ordering_unit: item.ordering_unit || "",
//       is_broken_case: item.is_broken_case || "",
//       content_url: item.content_url || "",
//       brand: item.brand || "",
//       taxonomy: item.taxonomy || "",
//       "level 1": "Frozen Foods",
//       "level 2": level2,
//       "level 3": "",
//       manufacturer_name: item.manufacturer_name || "",
//       distributor_name: "Sysco",
//       unit_price: item.unit_price || "",
//       extra_data: JSON.stringify(extraData)
//     };
//   });

//   // Convert the mapped data to CSV
//   const csv = parse(csvData, { fields: headers });

//   // Write the CSV data to a file
//   const outputFile = 'Frozen Foods.csv'; // Change to desired output file path
//   fs.writeFileSync(outputFile, csv);

//   console.log('CSV file has been successfully written!');
// } catch (error) {
//   console.error('Error processing the file:', error);
// }


