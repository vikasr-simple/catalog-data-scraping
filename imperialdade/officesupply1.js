const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Define file paths
const inputFilePath = './OfficeSupplies.csv';
const outputFilePath = './Processed_OfficeSupplies2.csv';

// Define patterns for size, SKU, and pack detection
const sizePattern = /[\d\.]+\s?(lb|oz|kg|g|ml|l|inch|cm)/i;
const packPattern = /\d+\s*\/\s*\w+/i;
const skuPattern = /^SKU#\s*(.*)/i; // Matches "SKU#" at the start

// Function to extract size
function extractSize(text) {
    const match = text.match(sizePattern);
    return match ? match[0] : null;
}

// Function to clean SKU by removing 'SKU#' prefix
function cleanSKU(sku) {
    const match = sku.match(skuPattern);
    return match ? match[1] : sku; // Keeps only the SKU number if "SKU#" is present
}

// Read, process, and write CSV data
const processedData = [];
fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
        const newRow = {};

        // Set image from 'image-src' if 'image' column is empty
        newRow['image'] = row['image'] || row['image-src'] || '';

        // Extract SKU and remove 'SKU#'
        newRow['sku'] = cleanSKU(row['sku'] || '');

        // Separate description and size
        const description = row['desc'] || '';
        const size = extractSize(description);
        
        // Store cleaned description (without size if found)
        newRow['desc'] = size ? description.replace(size, '').trim() : description;
        newRow['size'] = size;

        // Create extra_data JSON from remaining description parts
        const extraData = {};
        extraData['remaining_desc'] = newRow['desc']; // Put remaining description here if needed

        newRow['extra_data'] = JSON.stringify(extraData);

        processedData.push(newRow);
    })
    .on('end', () => {
        // Define CSV writer with updated headers
        const csvWriter = createCsvWriter({
            path: outputFilePath,
            header: [
                { id: 'image', title: 'image' },
                { id: 'sku', title: 'sku' },
                { id: 'desc', title: 'desc' },
                { id: 'size', title: 'size' },
                { id: 'extra_data', title: 'extra_data' },
            ],
        });

        // Write processed data to the output CSV file
        csvWriter.writeRecords(processedData)
            .then(() => console.log('CSV file was processed and saved successfully.'));
    });
