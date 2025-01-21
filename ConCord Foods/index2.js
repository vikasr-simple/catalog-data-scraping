import fs from "fs";
import { parse } from "json2csv";

try {
  // Read the JSON file
  const jsonData = JSON.parse(fs.readFileSync("./products.json", "utf8"));

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
      "extra_data",
    ];

    // Map each JSON object to the desired structure for the CSV
    const data = jsonArray
      .filter((product) => product?.name) // Remove rows without a 'name'
      .map((product) => {
        // Extract additional data for the 'extra_data' field
        const extraData = Object.keys(product).reduce((acc, key) => {
          if (!fields.includes(key) && key !== "image" && key !== "image_url") {
            acc[key] = product[key];
          }
          return acc;
        }, {});

        return {
          description: product?.desc || "",
          name: product?.name,
          sku: product?.productId || "",
          pack: product?.pack || "",
          size: product?.size || "",
          gtin: product?.gtin || "",

          retail_price: product?.price || "",
          is_catch_weight: product?.is_catch_weight || "",
          average_case_weight: product?.weight || "",
          image: product?.productImage,
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
          distributor_name: product?.distrubutor || "Greco & Sons",
          unitPrice: product?.unitPrice || "",
          extra_data: JSON.stringify(extraData) || "",
        };
      });

    // Convert the array of objects to a CSV string
    return parse(data, { fields });
  }

  // Save the CSV string to a file
  function saveCSV(csvString, filename) {
    fs.writeFileSync(filename, csvString, "utf8");
    console.log(`CSV file saved as ${filename}`);
  }

  // Convert JSON to CSV and save it
  const csvString = jsonToCSV(jsonData);
  saveCSV(csvString, "products.csv");
} catch (error) {
  console.error("Error processing the file:", error.message);
}

// Helper function to handle image URL
// function getImg(imageUrl) {
//     if (typeof imageUrl === 'string' && imageUrl.length > 0) {
//       // Extract the first URL before the space or comma (which indicate multiple URLs)
//       return imageUrl.split(',')[0].split(' ')[0].trim();
//     }
//     return "";
//   }
