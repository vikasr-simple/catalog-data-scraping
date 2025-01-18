const fs = require('fs');
const { parse } = require('json2csv');

// Path to your input JSON file
const inputFilePath = 'TowingandLifting.json'; // Change this to your actual file path
const outputFilePath = 'TowingandLifting.csv'; // Change this to your desired output file path

// Read the JSON data from the file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading the JSON file:", err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Column headers (adjust as per your specified columns)
  const headers = [
    "name", "sku", "gtin", "image", "pack", "size", "retail_price", "ordering_unit", 
    "is_catch_weight", "average_case_weight", "brand", "taxonomy", "level_1", "level_2", 
    "level_3", "manufacturer_name", "distributor_name", "content_url", "description", 
    "unit_price", "extra_data"
  ];

  // Process data to match the CSV format
  const processedData = jsonData.map(product => {
    return {
      name: product.title || '',
      sku: product.sku ? product.sku.replace('Item #', '').trim() : '', // Remove 'Item #' from sku
      gtin: product.gtin || '',
      image: product.images && product.images.length > 0 ? product.images[0] : '', // First image URL
      pack: product.pack || '',
      size: product.size || '',
      retail_price: product.price || '',
      ordering_unit: '',  // Assuming this field is not provided in the example
      is_catch_weight: product.isCatchWeight !== undefined ? product.isCatchWeight : '',
      average_case_weight: product.averageCaseWeight || '',
      brand: product.brandName || '',
      taxonomy: product.taxonomy || '',
      level_1: product.level1 || '',
      level_2: product.level2 || '',
      level_3: product.level3 || '',
      manufacturer_name: product.manufacturerName || '',
      distributor_name: 'Ace Hardware', // Add Ace Hardware as distributor name
      content_url: product.content_url || '',
      description: product.productOverview || '',
      unit_price: product.unitPrice || '',
      extra_data: JSON.stringify({
        images: product.images && product.images.length > 1 ? product.images.slice(1) : [], // Remaining image URLs
        extraDetails: product.extraDetails || '',
        specifications: product.specifications || ''
      }) || ''
    };
  });

  // Convert to CSV
  const csv = parse(processedData, { fields: headers });

  // Save to file
  fs.writeFileSync(outputFilePath, csv);

  console.log(`CSV file '${outputFilePath}' has been generated!`);
});
