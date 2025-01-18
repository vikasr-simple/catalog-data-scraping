


// // const fetch = require('node-fetch');
// // const fs = require('fs');


const API_URL = 'https://order.gfs.com/us-central1/api/v1/materials/additionalInfo';
// const YOUR_ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlc3lzY29fdXNlcl90eXBlIjoiTm9ybWFsIiwibmF0aXZlX3VzZXJfaWQiOiIwNTljb2ZmZWUiLCJjc3JmX3Rva2VuIjoiNGFhZDFlZTY1ZmMxZjAyYWQ0ZGE1NDg0MTFhMTY3MjQ0OTgwNzcyNCIsImN1c3RvbWVyX3V1aWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtNmQ5YS00YjFmMGUxOWNiOTAiLCJpc3MiOiJjeC1wZXJtaXNzaW9uLXNlcnZpY2UiLCJjbGllbnRfY29va2llX25hbWUiOiJNU1NfU1RBVEVGVUwiLCJzaG9wX3VzZXJfdHlwZSI6Im11bHRpX2J1eWVyIiwiYXV0aF91c2VyX2lkIjoiMDB1MTcxcGs5azgwWEo0WU81ZDciLCJzZXNzaW9uX2luZGV4IjoiXzMzMzg4NmYxYTQyYzRiN2RjM2M5MWNmZjI3ZDliZjkzMjQwOGUyOWFkMSIsInZpZCI6ImNtMGNneHJhaTAwMmQwOWpmOHp4ZGFybjAiLCJjbGllbnRUeXBlIjoiV0VCIiwic3lzY29fY3VzdF9hcHBfc290ZiI6IiIsInNjb3BlIjoidmlld09yZGVycyIsImVzeXNjb19pZCI6IjA1OWNvZmZlZSIsImV4cCI6MTcyNTM3MDQ1MywiZmlyc3RfbmFtZSI6IkthaXRsaW4iLCJpYXQiOjE3MjQ3NjU2NTMsImlzX211bHRpX2J1eWVyIjp0cnVlLCJsYXN0X25hbWUiOiJIZXJyZXJhIiwiY291bnRyaWVzIjpbIlVTIl0sImlzX211bHRpX2FwcHJvdmVyIjpmYWxzZSwibmFtZV9pZCI6ImNhcG5jb0Bob3RtYWlsLmNvbSIsInZlcnNpb24iOiIzLjAiLCJhdWQiOiJjeHMtc2hvcCIsInVzZXJfaWQiOiIwNTljb2ZmZWUiLCJzaG9wX2FjY291bnRfaWQiOiJ1c2JsLTA1OS0wNjA5MTgiLCJkZWZhdWx0X2NvdW50cnkiOiJVUyJ9.BWHtDwL-2YNIRFYXECDX7XoX8LqGzyKV0ji8r0HAyFlwZO5gfelIMINYTJyYL09h77KNzke-9nGvfmLY562sjUgFBW8EYYjgrnDNoJSDNs5hlPI8VGSMhNXMaQ17nx-STfu6h5KRY68WpfwSmdMx9af998KNbQLblC4IO3FhU8GnIu-soegtuRIrgNRiwiwaSPKh9dZ5_BlP9QGQODToK-qI_nE8Tv905Mr2r2JblJ4sHeUhQeYVIzs7Ee6GGnJZHie-hJI_qUP1AIM87BawwtBLrMagVBlVfH1oyq2MGsyLQY61Lx05q7hgD2RBN96dYuO5s9D7J2FBoWTWltDGTA'; // Replace with your actual token
// const YOUR_COOKIE_DATA = 'optimizelyEndUserId=oeu1724525048153r0.16797615342808614; vid=cm08hp4jd00003572fbdhbtw3; _fbp=fb.1.1724525069037.97922550613006076; _gcl_au=1.1.1351399030.1724525069; _cs_c=0; intercom-device-id-ms9yfvgq=58995906-72df-45b6-bfef-c497772b0cfd; _clck=1ct6gbj%7C2%7Cfoo%7C0%7C1697; _gid=GA1.2.956703043.1724750932; apollo-server-landing-page-redirect-to-studio-local=true; intercom-id-ms9yfvgq=e4458936-0c03-4940-9d58-e6c909f284d8; MSS_STATEFUL=%7B%22token%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlc3lzY29fdXNlcl90eXBlIjoiTm9ybWFsIiwibmF0aXZlX3VzZXJfaWQiOiIwNTljb2ZmZWUiLCJjc3JmX3Rva2VuIjoiNGFhZDFlZTY1ZmMxZjAyYWQ0ZGE1NDg0MTFhMTY3MjQ0OTgwNzcyNCIsImN1c3RvbWVyX3V1aWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtNmQ5YS00YjFmMGUxOWNiOTAiLCJpc3MiOiJjeC1wZXJtaXNzaW9uLXNlcnZpY2UiLCJjbGllbnRfY29va2llX25hbWUiOiJNU1NfU1RBVEVGVUwiLCJzaG9wX3VzZXJfdHlwZSI6Im11bHRpX2J1eWVyIiwiYXV0aF91c2VyX2lkIjoiMDB1MTcxcGs5azgwWEo0WU81ZDciLCJzZXNzaW9uX2luZGV4IjoiXzMzMzg4NmYxYTQyYzRiN2RjM2M5MWNmZjI3ZDliZjkzMjQwOGUyOWFkMSIsInZpZCI6ImNtMGNneHJhaTAwMmQwOWpmOHp4ZGFybjAiLCJjbGllbnRUeXBlIjoiV0VCIiwic3lzY29fY3VzdF9hcHBfc290ZiI6IiIsInNjb3BlIjoidmlld09yZGVycyIsImVzeXNjb19pZCI6IjA1OWNvZmZlZSIsImV4cCI6MTcyNTM3MDQ1MywiZmlyc3RfbmFtZSI6IkthaXRsaW4iLCJpYXQiOjE3MjQ3NjU2NTMsImlzX211bHRpX2J1eWVyIjp0cnVlLCJsYXN0X25hbWUiOiJIZXJyZXJhIiwiY291bnRyaWVzIjpbIlVTIl0sImlzX211bHRpX2FwcHJvdmVyIjpmYWxzZSwibmFtZV9pZCI6ImNhcG5jb0Bob3RtYWlsLmNvbSIsInZlcnNpb24iOiIzLjAiLCJhdWQiOiJjeHMtc2hvcCIsInVzZXJfaWQiOiIwNTljb2ZmZWUiLCJzaG9wX2FjY291bnRfaWQiOiJ1c2JsLTA1OS0wNjA5MTgiLCJkZWZhdWx0X2NvdW50cnkiOiJVUyJ9.BWHtDwL-2YNIRFYXECDX7XoX8LqGzyKV0ji8r0HAyFlwZO5gfelIMINYTJyYL09h77KNzke-9nGvfmLY562sjUgFBW8EYYjgrnDNoJSDNs5hlPI8VGSMhNXMaQ17nx-STfu6h5KRY68WpfwSmdMx9af998KNbQLblC4IO3FhU8GnIu-soegtuRIrgNRiwiwaSPKh9dZ5_BlP9QGQODToK-qI_nE8Tv905Mr2r2JblJ4sHeUhQeYVIzs7Ee6GGnJZHie-hJI_qUP1AIM87BawwtBLrMagVBlVfH1oyq2MGsyLQY61Lx05q7hgD2RBN96dYuO5s9D7J2FBoWTWltDGTA%22%7D; optimizelyEndUserId=oeu1724525048153r0.16797615342808614'; // Replace with your actual cookie data
// const YOUR_SYY_AUTHORIZATION = 'eyJkYXRhIjp7InNob3BBY2NvdW50SWQiOiJ1c2JsLTA1OS0wNjA5MTgiLCJzZWxsZXJzIjp7IlVTQkwiOnsic2VsbGVyQWNjb3VudElkIjoiMDYwOTE4Iiwic2l0ZUlkIjoiMDU5In19LCJzaG9wVXNlclR5cGUiOiJtdWx0aV9idXllciIsImNvdW50cnkiOiJVUyJ9LCJfaGFzaCI6ImQ2YWUxYTJmM2ExNDU4MjhmZTFhMThjNTZlYzQzZDM1In0='; // Replace with your actual SYY authorization
import fetch from 'node-fetch';
import fs from 'fs/promises';
import arr  from "./CleaningChemical12.json" assert {type: "json"};
console.log(arr.length);
const headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en_US",
    "Content-Length": "10",
    "Content-Type": "application/json",
    "Cookie": "rxVisitor=172500139767755R4S8PT5880704G84BS7QLKJTFCQQ0C; _swb=c762ca91-da21-4dde-be2a-d6d498842354; _ketch_consent_v1_=eyJhbmFseXRpY3MiOnsic3RhdHVzIjoiZ3JhbnRlZCIsImNhbm9uaWNhbFB1cnBvc2VzIjpbImFuYWx5dGljcyJdfSwiYmVoYXZpb3JhbF9hZHZlcnRpc2luZyI6eyJzdGF0dXMiOiJncmFudGVkIiwiY2Fub25pY2FsUHVycG9zZXMiOlsiYmVoYXZpb3JhbF9hZHZlcnRpc2luZyJdfSwiZXNzZW50aWFsX3NlcnZpY2VzIjp7InN0YXR1cyI6ImdyYW50ZWQiLCJjYW5vbmljYWxQdXJwb3NlcyI6WyJlc3NlbnRpYWxfc2VydmljZXMiXX19; gordonNow_ga=GA1.1.1102499164.1725001409; dtCookie=v_4_srv_6_sn_22E15FB732A97569D1C2E3D07FAD7DE5_perc_23161_ol_1_app-3A77f2132031842be3_0; GOR=us-central1; GCLB=CNSjoY3Ls4TYYxAD; _lr_uf_-fwixe9=e2c310cc-4164-4591-981d-fe5bc8f8dfe7; BIGipServerpool_nutritionService.gfs.com=1713693450.11571.0000; _gid=GA1.2.222323097.1725344759; _gcl_au=1.1.930183736.1725434058; _ga=GA1.1.507707986.1725001361; XSRF-TOKEN=9fa1b8fe-7ea7-46ec-b311-c4c0040c0c54; __Secure-GORDONORDERING2=YmEwNjk1MjgtMDAwMC00ZDEzLWFjNmYtNDcwOGMyNzVkNTkw; TS014b3d87=016aece3b3c3ee088f60d3be9dcf40eab58241cdba2e398d0b5bb000c9b4175f115ad1aa6e2ab5686a70ba2b9ac9c63a21fb9ae086; _lr_hb_-fwixe9%2Fnaoo-prd={%22heartbeat%22:1725438155630}; _swb_consent_=eyJjb2xsZWN0ZWRBdCI6MTcyNTQzODE2MSwiZW52aXJvbm1lbnRDb2RlIjoicHJvZHVjdGlvbiIsImlkZW50aXRpZXMiOnsic3diX3VzX2Rpc3RyaWJ1dGlvbiI6ImM3NjJjYTkxLWRhMjEtNGRkZS1iZTJhLWQ2ZDQ5ODg0MjM1NCJ9LCJqdXJpc2RpY3Rpb25Db2RlIjoiZGVmYXVsdCIsInByb3BlcnR5Q29kZSI6InVzX2Rpc3RyaWJ1dGlvbiIsInB1cnBvc2VzIjp7ImFuYWx5dGljcyI6eyJhbGxvd2VkIjoidHJ1ZSIsImxlZ2FsQmFzaXNDb2RlIjoiZGlzY2xvc3VyZSJ9LCJiZWhhdmlvcmFsX2FkdmVydGlzaW5nIjp7ImFsbG93ZWQiOiJ0cnVlIiwibGVnYWxCYXNpc0NvZGUiOiJkaXNjbG9zdXJlIn0sImVzc2VudGlhbF9zZXJ2aWNlcyI6eyJhbGxvd2VkIjoidHJ1ZSIsImxlZ2FsQmFzaXNDb2RlIjoiZGlzY2xvc3VyZSJ9fX0%3D; gordonNow_ga_CK5L5XCGJN=GS1.1.1725438160.7.0.1725438161.59.0.0; _lr_tabs_-fwixe9%2Fnaoo-prd={%22sessionID%22:0%2C%22recordingID%22:%225-04a7610d-db73-40e0-8c47-cee2c086ad09%22%2C%22webViewID%22:null%2C%22lastActivity%22:1725438179149}; _ga_X3LJM7Z737=GS1.1.1725433053.6.1.1725438182.23.0.0",
    "Origin": "https://order.gfs.com",
    "Priority": "u=1, i",
    "Referer": "https://order.gfs.com/product/455857",
    "Sec-CH-UA": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": "\"Windows\"",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "X-DTPC": "6$438153295_191h146vWUBADDHDOKRIHKKCUUUPJVFNMDMRTKOI-0e0",
    "X-DTReferer": "https://order.gfs.com/categories/results/2~092",
    "X-LogRocket-URL": "https://app.logrocket.com/fwixe9/naoo-prd/s/5-04a7610d-db73-40e0-8c47-cee2c086ad09/0/255a75c8-9e70-4a5e-a34a-0f67fd644fbc?t=1725438165414",
    "X-Requested-With": "XMLHttpRequest",
    "X-XSRF-TOKEN": "9fa1b8fe-7ea7-46ec-b311-c4c0040c0c54"
};






const fetchProducts = async (productId) => {
    const payload = [productId]
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers : headers,
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }

  };
;



const fetchAllProducts = async () => {
  const AllData = [];
  const batchSize = 100;
  const batches = [];

  // Split the array into batches of 100
  for (let i = 0; i < arr.length; i += batchSize) {
      const batch = arr.slice(i, i + batchSize);
      batches.push(batch);
  }

  for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const promises = batch.map(async product => {
          
          try {
            console.log(product);
            
          const res = await fetchProducts(product);
          console.log(`Fetched product ${product}`);
          
          return res;
        } catch (error) {
          console.error(`Error fetching product ${product}:`, error);
          return null;
        }
      });

      // Wait for all promises in the batch to resolve
      const batchResults = await Promise.all(promises);
      AllData.push(...batchResults);

      // Log after processing each batch
      console.log(`Batch ${i + 1} of ${batches.length} completed`);
  }

  return AllData;
};

fetchAllProducts().then((AllData) => {
  // Convert the data to a JSON string
  const jsonData = JSON.stringify(AllData, null, 2);

  // Write the data to a file
  fs.writeFile('CleaningChemical12_Data.json', jsonData, 'utf8', (err) => {
      if (err) {
          console.error('Error writing to file:', err);
      } else {
          console.log('Data has been successfully written to CubedDiced,Stew&KabobIDs.json');
      }
  });
});


// const res = await fetchProducts();
// console.log(res);







