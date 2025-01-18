import fs from 'fs';
import { parse } from 'json2csv';

// Import JSON data
import jsonData from './tommatoes.json' assert { type: 'json' };
import { title } from 'process';
import { assert, log } from 'console';

function jsonToCSV(jsonArray) {
  // Define headers
  const fields = [
     "name", "description", "material", "product_variants", "sku", "product_id","pack", 
    "size","unit","unit_count", "gtin", "retail_price", "is_catch_weight", 
    "average_case_weight", "image_url", "manufacturer_sku", "content_url", 
    "ordering_unit", "is_broken_case", "avg_case_weight", "brand","level1 category","level2 category", "level3 category", "level4 category","product-category-style","manufacturer_name","distributor_name","supplier_name","country_of_origin","Group"

  ];

  // Map JSON data to CSV-compatible format
  const categoryName = (category,idx)=>{
    if(category){
     const arr = category.split("/");
     return arr[idx];
    }
   
  }

  const imgUrl =( id)=>{   
    let url  = `https://www.don.com/UserFiles/Images/Products/Individuals/${id}.JPG`
    return url;
  }

  const productUrl =(id)=>{
    let url = `https://www.don.com/product/${id}?listType=General%20Catalog`
    return url
  }

  function parseProductData(jsonString , abc) {
    try {
        // Parse the JSON string into an object
        const parsedData = JSON.parse(jsonString);

       let result = parsedData[abc] || "";

        return result;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null; // Return null if parsing fails
    }
}


  // console.log("description",jsonArray)

  const data = jsonArray.map((product, index) => {

    if(index===0){
      console.log("product",product)
      console.log("description",product?.description)
      console.log("title",product?.title)
    }


  return{

    "name": product?.variant_pack?.item?.display_name || "",
    "description": product?.variant_pack?.item?.description|| "",
    "material": parseProductData( product?.json ,"material") || "",
    "product_variants":"",
    "sku":product?.variant_pack?.external_item_id || "",
    "product_id" : product?.variant_pack?.item?.uuid || "",
    "pack": product?.variant_pack?.pack?.base_unit || "",
    "size": product?.variant_pack?.pack?.max_unit_size || "",
    "unit": product?.variant_pack?.pack?.unit || "",
    "unit_count": product?.variant_pack?.pack?.unit_count || "",
    "gtin":product?.variant_pack?.metadata?.additional_info?.gtin_number ||"",
    "retail_price":product?.data?.getProducts[0]?.priceInfo?.case?.price||"",
    "is_catch_weight":"",
    "average_case_weight":"",
    "image_url": product?.variant_pack?.item?.photo_url_list || "",
    "manufacturer_sku": "",
    "content_url": parseProductData( product?.json ,"url") || "", 
    "ordering_unit":"",
    "is_broken_case":"",
    "avg_case_weight":"",
    "brand":product?.brand || "",
    "level1 category": product?.variant_pack?.item?.category || "",
    "level2 category":  "",
    "level3 category":   "",
    "level4 category":  "",
    "product-category-style": product?.style_name || "",
    "manufacturer_name":"",
    "distributor_name":"Ace Endico",
    "supplier_name":product?.supplier_name|| "",
    "country_of_origin": product?.country_name || "",
    "Group": "Food",
    
    }
  });


  
  return parse(data, { fields });
}

export default jsonToCSV;




function saveCSV(csvString, filename) {
  fs.writeFileSync(filename, csvString, 'utf8');
  console.log(`CSV file saved as ${filename}`);
}



// Convert JSON to CSV and save
const csvString = jsonToCSV(jsonData);
saveCSV(csvString, 'tommatoes.csv');