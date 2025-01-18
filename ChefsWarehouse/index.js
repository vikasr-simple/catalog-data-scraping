// script for convert sysco Data json to csv 

import fs from 'fs';
import { parse } from 'json2csv';

// Import JSON data
import jsonData from './suppliesequipment.json' with { type: 'json' };
import { title } from 'process';
import { log } from 'console';

function jsonToCSV(jsonArray) {
  // Define headers
  const fields = [
     "name", "description", "product_variants", "sku", "pack", 
    "size", "gtin", "retail_price", "is_catch_weight", 
    "average_case_weight", "image_url", "manufacturer_sku", "content_url", 
    "unit", "is_broken_case", "avg_case_weight", "brand","category","sub-category","product-category-style","manufacturer_name","distributor_name","supplier_name","country_of_origin","productDescriptor",
    "packagingInformation",
    "sizeAndShapeOfProduct",
    "yieldOrServingSize",
    "qualityAndFormat",
    "prepCookingInstructions",
    "storageAndUsage",
    "handlingInstructions",
    "additionalProductInformation",
    "grossWeight",
    "totalShelfLife",
    "unitPrice",
    "serving",
    "totalShelfLife",
    "generalDescription",
    "prepAndCookingInstructions",
    "servingSuggestions",
    "length",
    "width",
    "height",
    "county"

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
        
  //   "name": product?.data?.getProducts[0]?.productInfo?.description || "",
  //   "description": product?.data?.getProducts[0]?.productInfo?.lineDescription || "",
  //   "product_variants":"",
  //   "sku": product?.data?.getProducts[0]?.productId || "",
  //   "pack":product?.data?.getProducts[0]?.productInfo?.packSize?.pack || "",
  //   "size":product?.data?.getProducts[0]?.productInfo?.packSize?.size ||"",
  //   "gtin":"",
  //   "retail_price":product?.data?.getProducts[0]?.priceInfo?.case?.price||"",
  //   "is_catch_weight":"",
  //   "average_case_weight":"",
  //   "image_url":product?.data?.getProducts[0]?.productInfo?.images || "",
  //   "manufacturer_sku": "",
  //   "content_url":`https://shop.sysco.com/app/product-details/opco/059/product/${product?.data?.getProducts[0]?.productId}?seller_id=USBL`,
  //   "ordering_unit":"",
  //   "is_broken_case":"",
  //   "avg_case_weight":"",
  //   "brand":product?.data?.getProducts[0]?.productInfo?.brand?.name || "",
  //   "category": product?.data?.getProducts[0]?.productInfo?.taxonomy?.businessCenter || "",
  //   "sub-category": product?.data?.getProducts[0]?.productInfo?.taxonomy?.itemGroup || "",
  //   "product-category-style": product?.style_name || "",
  //   "manufacturer_name":"",
  //   "distributor_name":"Sysco Shop",
  //   "supplier_name":product?.supplier_name|| "",
  //   "country_of_origin": product?.country_name || "",
  //   "netWeight": product?.data?.getProducts[0]?.productInfo?.netWeight,
  //   "trueVendorName": product?.data?.getProducts[0]?.productInfo?.trueVendorName,
  //   "productDescriptor":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.productDescriptor,
  //    "packagingInformation":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.packagingInformation,
  //    "sizeAndShapeOfProduct":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.sizeAndShapeOfProduct,
  //    "yieldOrServingSize":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.yieldOrServingSize,
  //    "qualityAndFormat":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.qualityAndFormat,
  //    "prepCookingInstructions":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.prepCookingInstructions,
  //   "storageAndUsage":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.storageAndUsage,
  //   "handlingInstructions":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.handlingInstructions,
  //   "additionalProductInformation":product?.data?.getProducts[0]?.productInfo?.featuresAndBenefits?.additionalProductInformation,
  //    "grossWeight":product?.data?.getProducts[0]?.productInfo?.grossWeight,
  //    "totalShelfLife":product?.data?.getProducts[0]?.productInfo?.totalShelfLife,
  //     "unitPrice":product?.data?.getProducts[0]?.productInfo?.case?.each?.unitPrice,
  //     "serving":product?.data?.getProducts[0]?.productInfo?.uuom?.usageLot,
  //     "generalDescription":product?.data?.getProducts[0]?.productInfo?.categoryconsumerInformation?.generalDescription,
  //     "prepAndCookingInstructions":product?.data?.getProducts[0]?.productInfo?.consumerInformation?.prepAndCookingInstructions,
  //     "servingSuggestions":product?.data?.getProducts[0]?.productInfo?.consumerInformation?.servingSuggestions,
  //     "length":product?.data?.getProducts[0]?.productInfo?.dimension?.length,
  //     "width":product?.data?.getProducts[0]?.productInfo?.dimension?.width,
    //     "height":product?.data?.getProducts[0]?.productInfo?.dimension?.height,
    "name": product?.product?.name,
    "sku": product?.id,
    "pack": product?.package?.package,
    "size": product?.productSize?.size,
    "unit": product?.productSize?.unit?.unit,
    "retail_price": product?.price,
    "manufacturer_name": product?.manufacturer?.name,
    "county": product?.county,

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
saveCSV(csvString, 'suppliesequipment_Sysco.csv');

