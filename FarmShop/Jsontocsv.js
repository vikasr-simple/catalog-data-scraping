const fs = require('fs');
const { parse } = require('json2csv');

// Define the headers for the CSV
const headers = [
  'description', 'name', 'sku', 'pack', 'size', 'gtin', 'retail_price', 'is_catch_weight',
  'average_case_weight', 'image', 'manufacturer_sku', 'ordering_unit', 'is_broken_case',
  'content_url', 'brand', 'taxonomy', 'level 1', 'level 2', 'level 3', 'manufacturer_name',
  'distributor_name', 'unit_price', 'extra_data'
];

try {
  // Load the JSON file
  const jsonData = JSON.parse(fs.readFileSync('./further.json', 'utf8')); // Update the file path if needed

  // Map the JSON data to the desired CSV format
  const csvData = [jsonData].map(item => ({
    description: item.description || '',
    name: item.name || '',
    sku: '', // No SKU data in the sample
    pack: '', // No pack data in the sample
    size: '', // No size data in the sample
    gtin: '', // No GTIN data in the sample
    retail_price: item.retail_price || '', // Use the retail_price field
    is_catch_weight: '', // No is_catch_weight data in the sample
    average_case_weight: '', // No average_case_weight data in the sample
    image: item.image_url || '', // Use the image_url field
    manufacturer_sku: '', // No manufacturer_sku data in the sample
    ordering_unit: '', // No ordering_unit data in the sample
    is_broken_case: '', // No is_broken_case data in the sample
    content_url: item.content_url || '', // Use the content_url field
    brand: '', // No brand data in the sample
    taxonomy: '', // No taxonomy data in the sample
    'level 1': '', // Leave blank
    'level 2': '', // Leave blank
    'level 3': '', // Leave blank
    manufacturer_name: '', // Leave blank
    distributor_name: 'Further Products', // Add a static distributor name
    unit_price: '', // No unit_price data in the sample
    extra_data: '' // No extra data to include in this sample
  }));

  // Convert the data to CSV format
  const csv = parse(csvData, { fields: headers });

  // Write the CSV data to a file
  const outputFile = 'output.csv'; // Specify the output file name
  fs.writeFileSync(outputFile, csv);

  console.log('CSV file has been successfully created!');
} catch (error) {
  console.error('Error processing the file:', error);
}
