import fs from 'fs';
import { parse } from 'json2csv';

try {
  // Read the JSON file
  const jsonData = JSON.parse(fs.readFileSync('./poultry.json', 'utf8'));

  function jsonToCSV(jsonArray) {
    // Define the fields for the CSV
    const fields = ["name", "description", "price", "packSize", "imageUrl", "url"];

    // Map each JSON object to the desired structure for the CSV
    const data = jsonArray.map(product => ({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      packSize: product.size || "",
      imageUrl: product.img || "",
      url: product.url || ""
    }));

    // Convert the array of objects to a CSV string
    return parse(data, { fields });
  }

  // Save the CSV string to a file
  function saveCSV(csvString, filename) {
    fs.writeFileSync(filename, csvString, 'utf8');
    console.log(`CSV file saved as ${filename}`);
  }

  // Convert JSON to CSV and save it
  const csvString = jsonToCSV(jsonData);
  saveCSV(csvString, 'poultry.csv');

} catch (error) {
  console.error("Error processing the file:", error.message);
}
