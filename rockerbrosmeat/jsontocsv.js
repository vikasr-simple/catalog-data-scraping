import fs from 'fs';
import { parse } from 'json2csv';

try {
  // Read the JSON file
  const jsonData = JSON.parse(fs.readFileSync('./rockerbrosmeat.json', 'utf8'));
  console.log("JSON Data Length:", jsonData.length);
  
  function jsonToCSV(jsonArray) {
    // Define the fields for the CSV
    const fields = [
      "description",
      "name",
      "sku",
      "pack",
      "size",
      "gtin",
      "retail_price",
      "is_catch_weight",
      "average_case_weight",
      "image",
      "manufacturer_sku",
      "ordering_unit",
      "is_broken_case",
      "avg_case_weight",
      "content_url",
      "brand",
      "level 1",
      "level 2",
      "level 3",
      "manufacturer_name",
      "distributor_name",
      "unitPrice",
      "extra_data"
    ];

    // Map each JSON object to the desired structure for the CSV
    const data = jsonArray
      .filter(product => product?.name) // Remove rows without a 'name'
      .map(product => {
        // Extract additional data for the 'extra_data' field
        const extraData = Object.keys(product).reduce((acc, key) => {
          if (!fields.includes(key) && key !== 'image' && key !== 'image_url') {
            acc[key] = product[key];
          }
          return acc;
        }, {});

        // Extract 'pack' value from the description field
        const packMatch = product?.description?.match(/(\d+)\s*per case/i);
        const pack = packMatch ? packMatch[1] : "";

        const mappedProduct = {
          description: product?.description || "",
          name: product?.name,
          sku: product?.sku || "",
          pack: product?.pack,
          size: product?.size || "",
          gtin: product?.gtin || "",
          retail_price: product?.price || "",
          is_catch_weight: product?.is_catch_weight || "",
          average_case_weight: product?.average_case_weight || "",
          image: product?.imageUrl,
          manufacturer_sku: product?.manufacturer_sku || "",
          ordering_unit: product?.ordering_unit || "",
          is_broken_case: product?.is_broken_case || "",
          avg_case_weight: product?.avg_case_weight || "",
          content_url: product?.contentUrl || "",
          brand: product?.brand || "",
          "level 1": product?.level1 || product?.category1 || "",
          "level 2": product?.level2 || product?.subcategory || "",
          "level 3": product?.level3 || "",
          manufacturer_name: product?.manufacturer_name || "",
          distributor_name: product?.distrubutor || "Rocker Bros. Meat & Provision, Inc",
          unitPrice: product?.unitPrice || "",
          extra_data: JSON.stringify(extraData) || ""
        };

        console.log("Mapped Product:", mappedProduct);
        return mappedProduct;
      });

    console.log("Mapped Data Length:", data.length);

    // Convert the array of objects to a CSV string
    return parse(data, { fields });
  }

  // Convert JSON to CSV and save it
  const csvString = jsonToCSV(jsonData);
  saveCSV(csvString, 'rockerbrosmeat.csv');

} catch (error) {
  console.error("Error processing the file:", error.message);
}

// Save the CSV string to a file
function saveCSV(csvString, filename) {
  fs.writeFileSync(filename, csvString, 'utf8');
  console.log(`CSV file saved as ${filename}`);
}
