


// // const fetch = require('node-fetch');
// // const fs = require('fs');



// const YOUR_ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlc3lzY29fdXNlcl90eXBlIjoiTm9ybWFsIiwibmF0aXZlX3VzZXJfaWQiOiIwNTljb2ZmZWUiLCJjc3JmX3Rva2VuIjoiNGFhZDFlZTY1ZmMxZjAyYWQ0ZGE1NDg0MTFhMTY3MjQ0OTgwNzcyNCIsImN1c3RvbWVyX3V1aWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtNmQ5YS00YjFmMGUxOWNiOTAiLCJpc3MiOiJjeC1wZXJtaXNzaW9uLXNlcnZpY2UiLCJjbGllbnRfY29va2llX25hbWUiOiJNU1NfU1RBVEVGVUwiLCJzaG9wX3VzZXJfdHlwZSI6Im11bHRpX2J1eWVyIiwiYXV0aF91c2VyX2lkIjoiMDB1MTcxcGs5azgwWEo0WU81ZDciLCJzZXNzaW9uX2luZGV4IjoiXzMzMzg4NmYxYTQyYzRiN2RjM2M5MWNmZjI3ZDliZjkzMjQwOGUyOWFkMSIsInZpZCI6ImNtMGNneHJhaTAwMmQwOWpmOHp4ZGFybjAiLCJjbGllbnRUeXBlIjoiV0VCIiwic3lzY29fY3VzdF9hcHBfc290ZiI6IiIsInNjb3BlIjoidmlld09yZGVycyIsImVzeXNjb19pZCI6IjA1OWNvZmZlZSIsImV4cCI6MTcyNTM3MDQ1MywiZmlyc3RfbmFtZSI6IkthaXRsaW4iLCJpYXQiOjE3MjQ3NjU2NTMsImlzX211bHRpX2J1eWVyIjp0cnVlLCJsYXN0X25hbWUiOiJIZXJyZXJhIiwiY291bnRyaWVzIjpbIlVTIl0sImlzX211bHRpX2FwcHJvdmVyIjpmYWxzZSwibmFtZV9pZCI6ImNhcG5jb0Bob3RtYWlsLmNvbSIsInZlcnNpb24iOiIzLjAiLCJhdWQiOiJjeHMtc2hvcCIsInVzZXJfaWQiOiIwNTljb2ZmZWUiLCJzaG9wX2FjY291bnRfaWQiOiJ1c2JsLTA1OS0wNjA5MTgiLCJkZWZhdWx0X2NvdW50cnkiOiJVUyJ9.BWHtDwL-2YNIRFYXECDX7XoX8LqGzyKV0ji8r0HAyFlwZO5gfelIMINYTJyYL09h77KNzke-9nGvfmLY562sjUgFBW8EYYjgrnDNoJSDNs5hlPI8VGSMhNXMaQ17nx-STfu6h5KRY68WpfwSmdMx9af998KNbQLblC4IO3FhU8GnIu-soegtuRIrgNRiwiwaSPKh9dZ5_BlP9QGQODToK-qI_nE8Tv905Mr2r2JblJ4sHeUhQeYVIzs7Ee6GGnJZHie-hJI_qUP1AIM87BawwtBLrMagVBlVfH1oyq2MGsyLQY61Lx05q7hgD2RBN96dYuO5s9D7J2FBoWTWltDGTA'; // Replace with your actual token
// const YOUR_COOKIE_DATA = 'optimizelyEndUserId=oeu1724525048153r0.16797615342808614; vid=cm08hp4jd00003572fbdhbtw3; _fbp=fb.1.1724525069037.97922550613006076; _gcl_au=1.1.1351399030.1724525069; _cs_c=0; intercom-device-id-ms9yfvgq=58995906-72df-45b6-bfef-c497772b0cfd; _clck=1ct6gbj%7C2%7Cfoo%7C0%7C1697; _gid=GA1.2.956703043.1724750932; apollo-server-landing-page-redirect-to-studio-local=true; intercom-id-ms9yfvgq=e4458936-0c03-4940-9d58-e6c909f284d8; MSS_STATEFUL=%7B%22token%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlc3lzY29fdXNlcl90eXBlIjoiTm9ybWFsIiwibmF0aXZlX3VzZXJfaWQiOiIwNTljb2ZmZWUiLCJjc3JmX3Rva2VuIjoiNGFhZDFlZTY1ZmMxZjAyYWQ0ZGE1NDg0MTFhMTY3MjQ0OTgwNzcyNCIsImN1c3RvbWVyX3V1aWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtNmQ5YS00YjFmMGUxOWNiOTAiLCJpc3MiOiJjeC1wZXJtaXNzaW9uLXNlcnZpY2UiLCJjbGllbnRfY29va2llX25hbWUiOiJNU1NfU1RBVEVGVUwiLCJzaG9wX3VzZXJfdHlwZSI6Im11bHRpX2J1eWVyIiwiYXV0aF91c2VyX2lkIjoiMDB1MTcxcGs5azgwWEo0WU81ZDciLCJzZXNzaW9uX2luZGV4IjoiXzMzMzg4NmYxYTQyYzRiN2RjM2M5MWNmZjI3ZDliZjkzMjQwOGUyOWFkMSIsInZpZCI6ImNtMGNneHJhaTAwMmQwOWpmOHp4ZGFybjAiLCJjbGllbnRUeXBlIjoiV0VCIiwic3lzY29fY3VzdF9hcHBfc290ZiI6IiIsInNjb3BlIjoidmlld09yZGVycyIsImVzeXNjb19pZCI6IjA1OWNvZmZlZSIsImV4cCI6MTcyNTM3MDQ1MywiZmlyc3RfbmFtZSI6IkthaXRsaW4iLCJpYXQiOjE3MjQ3NjU2NTMsImlzX211bHRpX2J1eWVyIjp0cnVlLCJsYXN0X25hbWUiOiJIZXJyZXJhIiwiY291bnRyaWVzIjpbIlVTIl0sImlzX211bHRpX2FwcHJvdmVyIjpmYWxzZSwibmFtZV9pZCI6ImNhcG5jb0Bob3RtYWlsLmNvbSIsInZlcnNpb24iOiIzLjAiLCJhdWQiOiJjeHMtc2hvcCIsInVzZXJfaWQiOiIwNTljb2ZmZWUiLCJzaG9wX2FjY291bnRfaWQiOiJ1c2JsLTA1OS0wNjA5MTgiLCJkZWZhdWx0X2NvdW50cnkiOiJVUyJ9.BWHtDwL-2YNIRFYXECDX7XoX8LqGzyKV0ji8r0HAyFlwZO5gfelIMINYTJyYL09h77KNzke-9nGvfmLY562sjUgFBW8EYYjgrnDNoJSDNs5hlPI8VGSMhNXMaQ17nx-STfu6h5KRY68WpfwSmdMx9af998KNbQLblC4IO3FhU8GnIu-soegtuRIrgNRiwiwaSPKh9dZ5_BlP9QGQODToK-qI_nE8Tv905Mr2r2JblJ4sHeUhQeYVIzs7Ee6GGnJZHie-hJI_qUP1AIM87BawwtBLrMagVBlVfH1oyq2MGsyLQY61Lx05q7hgD2RBN96dYuO5s9D7J2FBoWTWltDGTA%22%7D; optimizelyEndUserId=oeu1724525048153r0.16797615342808614'; // Replace with your actual cookie data
// const YOUR_SYY_AUTHORIZATION = 'eyJkYXRhIjp7InNob3BBY2NvdW50SWQiOiJ1c2JsLTA1OS0wNjA5MTgiLCJzZWxsZXJzIjp7IlVTQkwiOnsic2VsbGVyQWNjb3VudElkIjoiMDYwOTE4Iiwic2l0ZUlkIjoiMDU5In19LCJzaG9wVXNlclR5cGUiOiJtdWx0aV9idXllciIsImNvdW50cnkiOiJVUyJ9LCJfaGFzaCI6ImQ2YWUxYTJmM2ExNDU4MjhmZTFhMThjNTZlYzQzZDM1In0='; // Replace with your actual SYY authorization
import fetch from 'node-fetch';
import fs from 'fs/promises';
import arr  from "./dairyProducts.json" assert {type: "json"};
console.log(arr.length);

const headers = {
  ":scheme": "https",
  "Accept": "application/json",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
  "Cookie": "EPi:StateMarker=true; EPi:StartUrlKey=https://www.chefswarehouse.com/products/dairy-and-eggs/dairy-products/; ARRAffinity=8feb9febfc599157ea6127e82202f2e98b6daa66ed20d2500672e20f7d969513; ARRAffinitySameSite=8feb9febfc599157ea6127e82202f2e98b6daa66ed20d2500672e20f7d969513; optimizelyEndUserId=oeu1725002177471r0.7066018870918853; ai_user=jbsbo|2024-08-30T07:16:17.909Z; PROD_cwUserData=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; exp_organizationId=46060560; exp_primaryBusinessUnit=104001; exp_secondaryBusinessUnit=; ai_session=kj/r8|1725019417647.4|1725019417647.4; PROD%3AApplicationCookie=_RxJ08DNcueST0mM8HahuvCFPhbxah_s_as-jRnqaONO4JvVOLdzVoB_wMVx3yk9WIHkymhdrSChpqPMiJuORcis-BVAr2x217-v1Xhu9yWAAdTZ72qo630GTzVVj7mgB5bDfdmk-NkH0siQCPhEPeRHTiP1kY4h0cPv_0IC-qYK6RUow-srykyl6cwdJVgHVSwjbDPRa8NkOt0B247IK-OKbiPJ2hQjqTZUabboUZ8kQ6ktj5zbp-tSuTAkyp3GQ7BIFB9zsTZHXogKRb_xha1WQmj3fFXEYVnAcW8aKdQOFn27Ci_snY0TVQNi2luGKZ3124KIfHdoMWJ-pdhbnmTkybh2qEjPsMHEd_s4mCvd5nOFVH67i5z_ANRgrNiYjA_NE0yBlxHpS-V8UgmpU_8-jsR9b5jELo4YvN9fxZs90S9hF0LKdwgbNBB9YXfvBm5bnxMia58jLZxPRHF-lJzvVIA4cYCSmgcriseYueqwS8rdg2hNDn9ZpsJt4tWhqDwWPXWEXlGk7Ih3EHIlvpcHrX09IbhGAv8TZ4-xc6GX8ivs7qbokWlAU1nroZgY6WmT738DJr0ub8hSHia5S95oNeTRjrZnvL02m6UPEOYHtgTNCPydizk1JMoZhugy",
  "If-None-Match": "\"1750010323\"",
  "Priority": "u=1, i",
  "Referer": "https://www.chefswarehouse.com/products/dairy-and-eggs/dairy-products/",
  "Sec-CH-UA": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
  "Sec-CH-UA-Mobile": "?0",
  "Sec-CH-UA-Platform": "\"Windows\"",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
};


const fetchProducts = async (skUid) => {
const API_URL = `https://www.chefswarehouse.com/products/${skUid}/?expand=*&currentPageUrl=%252Fproducts%252FDM116%252F&tz=Asia%252FCalcutta&t=1725005751994`;
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: headers
        })
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
        const { sku } = product;
        console.log(sku);
        
          try {
          const res = await fetchProducts(sku);
          console.log(`Fetched product ${sku}`);
          console.log(res);
          
            return res;
            
        } catch (error) {
          console.error(`Error fetching product ${sku}:`, error);
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
  fs.writeFile('dairyProductData.json', jsonData, 'utf8', (err) => {
      if (err) {
          console.error('Error writing to file:', err);
      } else {
          console.log('Data has been successfully written to dairyProductData.json');
      }
  });
});


// const res = await fetchProducts();
// console.log(res);







