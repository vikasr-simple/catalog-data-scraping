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
  const jsonData = JSON.parse(fs.readFileSync('./allProductDetails.json', 'utf8')); // Update the file path if needed

  // Map the JSON data to the desired CSV format
  const csvData = [jsonData].map(item => ({
    description: item.description || '',
    name: item.name || '',
    sku: item.sku || '',
    pack: '', // No data provided for pack
    size: '', // No data provided for size
    gtin: '', // No GTIN data
    retail_price: item.price || '', // Map price to retail_price
    is_catch_weight: '', // No data provided for is_catch_weight
    average_case_weight: '', // No data provided for average_case_weight
    image: item.images?.[0]?.src || '', // Use the first image URL
    manufacturer_sku: '', // No manufacturer_sku data
    ordering_unit: '', // No ordering_unit data
    is_broken_case: '', // No data provided
    content_url: item.contentUrl || '', // Map contentUrl to content_url
    brand: '', // No brand data
    taxonomy: '', // No taxonomy data
    'level 1': '', // Leave blank
    'level 2': '', // Leave blank
    'level 3': '', // Leave blank
    manufacturer_name: '', // Leave blank
    distributor_name: 'ChefsToys', // Set distributor name as ChefsToys
    unit_price: '', // No unit_price data
    extra_data: JSON.stringify({
      features: item.features || [],
      badges: item.badges || [],
      shippingInfo: item.shippingInfo || ''
    }), // Store additional fields as JSON string
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
