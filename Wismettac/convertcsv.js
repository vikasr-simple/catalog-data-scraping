import fs from 'fs';
import { parse } from 'json2csv';

try {
  // Ensure the file has the correct path and extension
  const jsonData = JSON.parse(fs.readFileSync('./SUPPLIES.json', 'utf8'));

  function jsonToCSV(jsonArray) {
    const fields = [
      "description",
      "sku",
      "pack",
      "size",
      "gtin",
      "name",
      "retail_price",
      "is_catch_weight",
      "average_case_weight",
      "image",
      "manufacturer_sku",
      "ordering_unit",
      "is_broken_case",
      "content_url",
      "brand",
      "level_1",
      "level_2",
      "level_3",
      "manufacturer_name",
      "distributor_name",
      "unit_price",
      "extra_data"
    ];

    const data = jsonArray.map(product => {
      const mappedProduct = {
        description: product.description || "",
        name: product.name || "",
        sku: product.itemNumber || "",
        pack: product.pack || "",
        size: product.packSize || "",
        gtin: product.gtin || "",
        retail_price: product.retailPrice || "",
        is_catch_weight: product.isCatchWeight || "",
        average_case_weight: product.averageCaseWeight || "",
        image: product.mainImageUrl || "",
        manufacturer_sku: product.manufacturerSku || "",
        ordering_unit: product.orderingUnit || "",
        is_broken_case: product.isBrokenCase || "",
        content_url: product.link || "",
        brand: product.brand || "",
        level_1: product.level1 || "",
        level_2: product.level2 || "",
        level_3: product.level3 || "",
        manufacturer_name: product.manufacturerName || "",
        distributor_name: product.distributorName || "",
        unit_price: product.unitPrice || ""
      };

      // Collect any extra data not included in the fields above
      const extraData = Object.keys(product).reduce((acc, key) => {
        if (!Object.keys(mappedProduct).includes(key)) {
          acc[key] = product[key];
        }
        return acc;
      }, {});

      mappedProduct.extra_data = JSON.stringify(extraData);
      return mappedProduct;
    });

    return parse(data, { fields });
  }

  function saveCSV(csvString, filename) {
    fs.writeFileSync(filename, csvString, 'utf8');
    console.log(`CSV file saved as ${filename}`);
  }

  const csvString = jsonToCSV(jsonData);
  saveCSV(csvString, 'SUPPLIES.csv');

} catch (error) {
  console.error("Error processing the file:", error.message);
}
