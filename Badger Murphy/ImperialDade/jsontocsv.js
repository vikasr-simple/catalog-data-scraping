import fs from 'fs';
import { parse } from 'json2csv';

try {
  const jsonData = JSON.parse(fs.readFileSync('./Disposable Take-Out.json', 'utf8')); // Replace with your actual JSON file path

  // Function to extract the first GTIN value from "UPC-14 (GTIN):"
  function getGTIN(specifications) {
    if (specifications && specifications['UPC-14 (GTIN):']) {
      const gtinValue = specifications['UPC-14 (GTIN):'].split(',')[0].trim(); // Get the first GTIN value
      console.log(`Extracted GTIN: ${gtinValue}`); // Debugging line
      return gtinValue;
    }
    console.log("No GTIN found for this product."); // Debugging line
    return "";
  }

  // Function to get size from "Product Capacity:"
  function getSize(specifications) {
    return specifications?.['Product Capacity:'] || '';
  }

  function jsonToCSV(jsonArray) {
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

    const data = jsonArray
      .filter(product => product?.name)
      .map(product => {
        const gtin = getGTIN(product?.specifications); // Use the helper function to get GTIN
        const size = getSize(product?.specifications); // Use the helper function to get size

        // Collect extra data fields
        const extraData = Object.keys(product).reduce((acc, key) => {
          if (!fields.includes(key) && key !== 'image' && key !== 'imageUrl' && key !== 'specifications') {
            acc[key] = product[key];
          }
          return acc;
        }, {});

        // Add non-standard specifications as extra data
        if (product.specifications) {
          for (const [key, value] of Object.entries(product.specifications)) {
            if (!["UPC-14 (GTIN):", "Product Capacity:"].includes(key)) {
              extraData[key] = value;
            }
          }
        }

        // Return main fields and the extra_data field
        return {
          description: product?.desc || "",
          name: product?.name,
          sku: product?.sku || "",
          pack: product?.pack || "",
          size: size, // Use the extracted size
          gtin: gtin, // Use the extracted GTIN
          retail_price: product?.price || "",
          is_catch_weight: product?.is_catch_weight || "",
          average_case_weight: product?.average_case_weight || "",
          image: product?.imageUrl || "",
          manufacturer_sku: product?.manufacturerCode || "",
          ordering_unit: product?.ordering_unit || "",
          is_broken_case: product?.is_broken_case || "",
          avg_case_weight: product?.avg_case_weight || "",
          content_url: product?.productUrl || "",
          brand: product?.brand || "",
          "level 1": product?.level1 || product?.category1 || "",
          "level 2": product?.level2 || product?.subcategory || "",
          "level 3": product?.level3 || "",
          manufacturer_name: product?.manufacturer_name || "",
          distributor_name: product?.distributor_name || "Imperial Dade",
          unitPrice: product?.unitPrice || "",
          extra_data: JSON.stringify(extraData) || "" // Convert extra data to JSON string format
        };
      });

    return parse(data, { fields, defaultValue: "" });
  }

  const csvString = jsonToCSV(jsonData);
  fs.writeFileSync('Disposable Take-Out.csv', csvString, 'utf8');
  console.log(`CSV file saved as Writing & Correction Supplies.csv`);

} catch (error) {
  console.error("Error processing the file:", error.message);
}  
