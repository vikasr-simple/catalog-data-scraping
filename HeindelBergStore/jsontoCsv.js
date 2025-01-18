import fs from 'fs';
import { parse } from 'json2csv';

// Import JSON data
import jsonData from './bear.json' assert { type: 'json' };

function jsontoCsv(jsonArray) {
  // Define headers
  const fields = [
    'description',
    'name',
    'sku',
    'pack',
    'size',
    'gtin',
    'retail_price',
    'is_catch_weight',
    'average_case_weight',
    'image',
    'manufacturer_sku',
    'ordering_unit',
    'is_broken_case',
    'content_url',
    'brand',
    'taxonomy',
    'level 1',
    'level 2',
    'level 3',
    'manufacturer_name',
    'distributor_name',
    'unit_price',
    'extra_data',
  ];

  const generateContentUrl = (link) => {
    const baseUrl = 'https://heidelberg.storefronts.site';
    return link ? `${baseUrl}${link}` : '';
  };

  const data = jsonArray.map((product) => {
    const {
      sku,
      name,
      sizing: pack,
      size_formatted: size,
      image_url: image,
      link,
      producer_name: brand,
      product_description: description,
      ...extraFields
    } = product;

    return {
      description: description || '',
      name: name || '',
      sku: sku || '',
      pack: pack || '',
      size: size || '',
      gtin: '', // Assuming gtin not in sample JSON
      retail_price: '', // Assuming price not in sample JSON
      is_catch_weight: '',
      average_case_weight: '',
      image: image || '',
      manufacturer_sku: '',
      ordering_unit: '',
      is_broken_case: '',
      content_url: generateContentUrl(link),
      brand: brand || '',
      taxonomy: '',
      level_1: 'Wine',
      level_2: '',
      level_3: '',
      manufacturer_name: '',
      distributor_name: 'Heidelberg Store',
      unit_price: '',
      extra_data: JSON.stringify(extraFields),
    };
  });

  return parse(data, { fields });
}

function saveCSV(csvString, filename) {
  fs.writeFileSync(filename, csvString, 'utf8');
  console.log(`CSV file saved as ${filename}`);
}

// Convert JSON to CSV and save
const csvString = jsontoCsv(jsonData);
saveCSV(csvString, 'bear.csv');
