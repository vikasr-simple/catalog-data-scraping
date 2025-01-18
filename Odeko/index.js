import fs from 'fs';
import { parse } from 'json2csv';

// Import JSON data
import jsonData from './cleaningSupplies.json' assert { type: 'json' };
import { title } from 'process';
import { log } from 'console';

function jsonToCSV(jsonArray) {
  // Define headers
  const fields = [
    "id", "name", "description", "product_variants", "sku", "pack", 
    "size", "gtin", "sale_price", "is_catch_weight", 
    "average_case_weight", "image_url", "vendor_sku", "content_url", 
    "ordering_unit", "is_broken_case", "avg_case_weight", "brand", "category", "sub-category", "product-category-style", "vendor_name", "distributor_name", "supplier_name", "country_of_origin", "productDescriptor",
    "sellingBulletPoints","shelfLife",
    // "packagingInformation",
    // "sizeAndShapeOfProduct",
    // "yieldOrServingSize",
    // "qualityAndFormat",
    // "prepCookingInstructions",product?.additionalInfos[0]?.
    // "storageAndUsage",
    // "handlingInstructions",
    // "additionalProductInformation",
    // "grossWeight",
    // "totalShelfLife",
    // "unitPrice",
    // "serving",
    // "totalShelfLife",
    // "generalDescription",
    // "prepAndCookingInstructions",
    // "servingSuggestions",
    "materialYield",
    "length",
    "width",
    "height",
    "nutritionalInfo",
    "allergenInfo",
    "servingSuggestions",
    "preparationSuggestions",
    "packagingStorage",
    // "features"

  ];

  // Map JSON data to CSV-compatible format
  const getImg = (img)=>{
    if(img){
      const image = `https://www.abc.virginia.gov${img}`
      return image;
    }
    return null;
  }

  // console.log("description",jsonArray)

  const data = jsonArray.map((product, index) => {

    if(index===0){
      console.log("product",product)
      console.log("description",product?.description)
      console.log("title",product?.title)
    }


  return{
    


    "id": product?.id || "",
    "name":product?.name || "",
    "description": product?.description || "",
    "product_variants":"",
    "sku": product?.category?.id || "",
    "pack": product?.saleUnit?.name || "",
    "size":product?.size?.label ||"",
    "gtin":"",
    "sale_price":product?.salePrice?.cents || "",
    // "is_catch_weight":"",
    // "average_case_weight":"",
    "image_url":product?.imgUrl || "",
    // "vendor_sku": "",
    "content_url":`https://portal.odeko.com/supply/locations/238ae091-397c-480d-b630-88c1202274b1/catalog/item/${product?.id}`,
    // "ordering_unit":product?.saleUnit?.name ||"",
    // "is_broken_case":"",
    // "avg_case_weight":"",
    "brand":product?.brandName || "",
    "category": product?.category?.name || "",
    "sub-category": product?.subcategory?.name || "",
    // "product-category-style": "",
    // "vendor_name":product?.additionalInfos[0]?.vendorInfo?.displayName||"",
    "distributor_name":"ODEKO",
    // "features":
  }

  });

  // Convert JSON array to CSV string
  // console.log("DATTAAEFTRF",data);
  
  return parse(data, { fields });
}

export default jsonToCSV;




function saveCSV(csvString, filename) {
  fs.writeFileSync(filename, csvString, 'utf8');
  console.log(`CSV file saved as ${filename}`);
}



// Convert JSON to CSV and save
const csvString = jsonToCSV(jsonData);
saveCSV(csvString, 'CleaningSupplies.csv');

