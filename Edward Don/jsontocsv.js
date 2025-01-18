// import fs from 'fs';
// import { parse } from 'json2csv';

// // Import JSON data
// import jsonData from './apparel/Aprons new.json' with { type: 'json' };
// import jsonData1 from './apparel/Aprons.js'
// import { title } from 'process';
// import { log } from 'console';

// function jsonToCSV(jsonArray, jsonData1) {
//   // Define headers
//   const fields = [
//      "name", "description", "material", "product_variants", "sku", "product_id","pack", 
//     "size", "gtin", "retail_price", "is_catch_weight", 
//     "average_case_weight", "image_url", "manufacturer_sku", "content_url", 
//     "ordering_unit", "is_broken_case", "avg_case_weight", "brand","level1 category","level2 category", "level3 category", "level4 category","product-category-style","manufacturer_name","distributor_name","supplier_name","country_of_origin"

//   ];

//   // Map JSON data to CSV-compatible format
//   const categoryName = (category,idx)=>{
//     if(category){
//      const arr = category.split("/");
//      return arr[idx];
//     }
   
//   }

//   const imgUrl =( id)=>{   
//     let url  = `https://www.don.com/UserFiles/Images/Products/Individuals/${id}.JPG`
//     return url;
//   }

//   const productUrl =(id)=>{
//     let url = `https://www.don.com/product/${id}?listType=General%20Catalog`
//     return url
//   }

//   function parseProductData(jsonString , abc) {
//     try {
//         // Parse the JSON string into an object
//         const parsedData = JSON.parse(jsonString);

//        let result = parsedData[abc] || "";

//         return result;
//     } catch (error) {
//         console.error('Error parsing JSON:', error);
//         return null; // Return null if parsing fails
//     }
// }


//   // console.log("description",jsonArray)

//   const data = jsonArray.map((product, index) => {

//     if(index===0){
//       console.log("product",product)
//       console.log("description",product?.description)
//       console.log("title",product?.title)
//     }


//   return{

//     "name": product?.name || "",
//     "description": parseProductData( product?.json , "description") || "",
//     "material": parseProductData( product?.json ,"material") || "",
//     "product_variants":"",
//     "sku": product?.id || "",
//     "product_id" : product?.productId || "",
//     "pack":product?.data?.getProducts[0]?.productInfo?.packSize?.pack || "",
//     "size":product?.data?.getProducts[0]?.productInfo?.packSize?.size ||"",
//     "gtin":"",
//     "retail_price":product?.data?.getProducts[0]?.priceInfo?.case?.price||"",
//     "is_catch_weight":"",
//     "average_case_weight":"",
//     "image_url": imgUrl(product?.id) || "",
//     "manufacturer_sku": "",
//     "content_url": parseProductData( product?.json ,"url") || "", 
//     "ordering_unit":"",
//     "is_broken_case":"",
//     "avg_case_weight":"",
//     "brand":product?.brand || "",
//     "level1 category": categoryName(product?.category,0) || "",
//     "level2 category": categoryName(product?.category,1) || "",
//     "level3 category": categoryName(product?.category,2) || "",
//     "level4 category": categoryName(product?.category,3) || "",
//     "product-category-style": product?.style_name || "",
//     "manufacturer_name":"",
//     "distributor_name":"Edward don",
//     "supplier_name":product?.supplier_name|| "",
//     "country_of_origin": product?.country_name || "",
    
//     }
//   });


  
//   return parse(data, { fields });
// }

// export default jsonToCSV;




// function saveCSV(csvString, filename) {
//   fs.writeFileSync(filename, csvString, 'utf8');
//   console.log(`CSV file saved as ${filename}`);
// }



// // Convert JSON to CSV and save
// const csvString = jsonToCSV(jsonData,jsonData1);
// saveCSV(csvString, 'Floor.csv');

// import fs from 'fs';
// import { parse } from 'json2csv';

// // Import JSON data
// import jsonData from './apparel/Aprons new.json' with { type: 'json' };
// import jsonData1 from './apparel/Aprons.js';
// import { log } from 'console';

// function jsonToCSV(jsonArray, jsonData1) {
//   // Define headers
//   const fields = [
//     "name", "description", "material", "product_variants", "sku", "product_id", "pack",
//     "size", "gtin", "retail_price", "is_catch_weight",
//     "average_case_weight", "image_url", "manufacturer_sku", "content_url",
//     "ordering_unit", "is_broken_case", "avg_case_weight", "brand", "level1 category", "level2 category", "level3 category", "level4 category",
//     "product-category-style", "manufacturer_name", "distributor_name", "supplier_name", "country_of_origin"
//   ];

//   // Map JSON data to CSV-compatible format
//   const categoryName = (category, idx) => {
//     if (category) {
//       const arr = category.split("/");
//       return arr[idx];
//     }
//   };

//   const imgUrl = (id) => {
//     let url = `https://www.don.com/UserFiles/Images/Products/Individuals/${id}.JPG`;
//     return url;
//   };

//   const productUrl = (id) => {
//     let url = `https://www.don.com/product/${id}?listType=General%20Catalog`;
//     return url;
//   };

//   function parseProductData(jsonString, field) {
//     try {
//       // Parse the JSON string into an object
//       const parsedData = JSON.parse(jsonString);
//       return parsedData[field] || "";
//     } catch (error) {
//       console.error('Error parsing JSON:', error);
//       return null; // Return null if parsing fails
//     }
//   }

//   // Check if `jsonData1` has a matching packDescription for each `product.id` in `jsonData`
//   const getPackDescription = (productId) => {
//     // Only return `packDescription` if `id` in `jsonData` matches `name` in `jsonData1`
//     return jsonData1.name === productId ? jsonData1.packDescription : "";
//   };

//   const data = jsonArray.map((product, index) => {
//     if (index === 0) {
//       console.log("product", product);
//       console.log("description", product?.description);
//       console.log("title", product?.title);
//     }

//     return {
//       "name": product?.name || "",
//       "description": parseProductData(product?.json, "description") || "",
//       "material": parseProductData(product?.json, "material") || "",
//       "product_variants": "",
//       "sku": product?.id || "",
//       "product_id": product?.productId || "",
//       "pack": getPackDescription(product?.id), // Conditionally set pack based on matching id
//       "size": product?.data?.getProducts[0]?.productInfo?.packSize?.size || "",
//       "gtin": "",
//       "retail_price": product?.data?.getProducts[0]?.priceInfo?.case?.price || "",
//       "is_catch_weight": "",
//       "average_case_weight": "",
//       "image_url": imgUrl(product?.id) || "",
//       "manufacturer_sku": "",
//       "content_url": parseProductData(product?.json, "url") || "",
//       "ordering_unit": "",
//       "is_broken_case": "",
//       "avg_case_weight": "",
//       "brand": product?.brand || "",
//       "level1 category": categoryName(product?.category, 0) || "",
//       "level2 category": categoryName(product?.category, 1) || "",
//       "level3 category": categoryName(product?.category, 2) || "",
//       "level4 category": categoryName(product?.category, 3) || "",
//       "product-category-style": product?.style_name || "",
//       "manufacturer_name": "",
//       "distributor_name": "Edward don",
//       "supplier_name": product?.supplier_name || "",
//       "country_of_origin": product?.country_name || "",
//     };
//   });

//   return parse(data, { fields });
// }

// export default jsonToCSV;

// function saveCSV(csvString, filename) {
//   fs.writeFileSync(filename, csvString, 'utf8');
//   console.log(`CSV file saved as ${filename}`);
// }

// // Convert JSON to CSV and save
// const csvString = jsonToCSV(jsonData, jsonData1);
// saveCSV(csvString, 'Aprons_new.csv');

import fs from 'fs';
import { parse } from 'json2csv';

// Import JSON data
import jsonData from './buffetService/servingUtensils/servingUtensils.json' assert { type: 'json' };
import jsonData1 from './buffetService/servingUtensils/data.js';
import { assert } from 'console';

function jsonToCSV(jsonArray, jsonData1) {
  // Define headers
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

  // Helper functions
  const categoryName = (category, idx) => {
    if (category) {
      const arr = category.split("/");
      return arr[idx] || "";
    }
    return "";
  };

  const imgUrl = (id) => {
    return `https://www.don.com/UserFiles/Images/Products/Individuals/${id}.JPG`;
  };

  const productUrl = (id) => {
    return `https://www.don.com/product/${id}?listType=General%20Catalog`;
  };

  function parseProductData(jsonString, field) {
    try {
      const parsedData = JSON.parse(jsonString);
      return parsedData[field] || "";
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }

  // Function to get packDescription if product.id matches jsonData1.name
  const getPackDescription = (productId) => {
    return jsonData1.find(item => item.name === productId)?.packDescription || "";
  };

  const getOrderUnit = (productId) => {
    return jsonData1.find(item => item.name === productId)?.unitOfMeasure || "";
  };

  const getExtraData = (product) => {
    const matchingItem = jsonData1.find(item => item.name === product.id) || {};
    return JSON.stringify({ productData: product, matchingData: matchingItem });
  };

  // Map JSON data to CSV-compatible format
  const data = jsonArray.map((product, index) => {
    if (index === 0) {
      console.log("Product example:", product);
      console.log("Description:", product?.description);
      console.log("Title:", product?.title);
    }

    const category = product?.category || "";

    return {
      "description": parseProductData(product?.json, "description") || "",
      "name": product?.name || "",
      "sku": product?.id || "",
      "pack": getPackDescription(product?.id),
      "size": product?.data?.getProducts[0]?.productInfo?.packSize?.size || "",
      "gtin": "",
      "retail_price": product?.data?.getProducts[0]?.priceInfo?.case?.price || "",
      "is_catch_weight": "",
      "average_case_weight": "",
      "image": imgUrl(product?.id) || "",
      "manufacturer_sku": "",
      "ordering_unit": getOrderUnit(product?.id) || "",
      "is_broken_case": "",
      "content_url": parseProductData(product?.json, "url") || "",
      "brand": product?.brand || "",
      "level 1": categoryName(category, 0),
      "level 2": categoryName(category, 1),
      "level 3": categoryName(category, 2),
      "manufacturer_name": "",
      "distributor_name": "Edward don",
      "unitPrice": "",
      "extra_data": getExtraData(product)
    };
  });

  return parse(data, { fields });
}

export default jsonToCSV;

function saveCSV(csvString, filename) {
  fs.writeFileSync(filename, csvString, 'utf8');
  console.log(`CSV file saved as ${filename}`);
}

// Convert JSON to CSV and save
const csvString = jsonToCSV(jsonData, jsonData1);
saveCSV(csvString, 'Serving Utensils.csv');
