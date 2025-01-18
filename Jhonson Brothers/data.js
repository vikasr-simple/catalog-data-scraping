const fs = require('fs');
const csv = require('csv-parser');
const inputCsvPath = 'Spirits-Order-Guide.csv'; // Your local CSV file
const outputCsvPath = 'Cleaned-Spirits-Order-Guide.csv'; // Output CSV

// Create a write stream for the output CSV file
const writeStream = fs.createWriteStream(outputCsvPath);

// To store headers
let isFirstHeader = true;
let headerLine = null;

// Write the cleaned data into the new CSV file
writeStream.write('');  // Clear the file if it already exists

// Start reading and parsing the CSV file
fs.createReadStream(inputCsvPath)
  .pipe(csv())
  .on('headers', (headers) => {
    if (isFirstHeader) {
      headerLine = headers.join(',');
      writeStream.write(`${headerLine}\n`);  // Write the first header
      isFirstHeader = false;
    }
  })
  .on('data', (row) => {
    // Skip repeated headers
    const rowValues = Object.values(row);
    const rowString = rowValues.join(',');

    if (rowString !== headerLine) {
      writeStream.write(`${rowString}\n`);
    }
  })
  .on('end', () => {
    console.log(`Cleaned CSV file has been written to ${outputCsvPath}`);
  });