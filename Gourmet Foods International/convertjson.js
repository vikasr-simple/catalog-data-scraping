const fs = require('fs');
const path = require('path');

// Specify the directory containing the JSON files
const directoryPath = path.join(__dirname, 'json-files'); // Change 'json-files' to your directory

// Output file where the merged JSON will be saved
const outputFilePath = path.join(__dirname, 'merged.json');

// Function to merge all JSON files
function mergeJSONFiles() {
  // Read all files in the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return;
    }

    // Filter out only JSON files
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    let mergedData = [];

    // Read each JSON file and merge the data
    jsonFiles.forEach((file, index) => {
      const filePath = path.join(directoryPath, file);

      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Merge data (assuming you want to append the data of each file)
      mergedData = mergedData.concat(fileData);
    });

    // Write the merged data to a single JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedData, null, 2), 'utf8');
    console.log('Merged JSON saved to', outputFilePath);
  });
}

mergeJSONFiles();
