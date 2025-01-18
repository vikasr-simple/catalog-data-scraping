
import fetch from 'node-fetch';
import fs from 'fs/promises';

const API_URL = 'https://www.chefswarehouse.com/products/dairy-and-eggs/dairy-products//search';



const pageSize = 15;
const incrimentsize = 1;// Number of items per page
let allData = [];
let start = 0;
let hasMoreData = true; // Flag to check if there are more pages
// import data from './productsData.json' with { type: "json"}
// console.log(data.length);


const fetchProducts = async (start) => {
    const payload = {"search":{"page":start,"pageSize":15,"facets":[],"sortBy":null,"direction":null}}  
       

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers:{
            "access-control-expose-headers": "Request-Context",
            "cache-control": "private",
            "cf-cache-status": "DYNAMIC",
            "cf-ray": "8bb3087b6bae9632-DEL",
            "content-encoding": "gzip",
            "content-length": "5283",
            "content-type": "application/json; charset=utf-8",
            "date": "Fri, 30 Aug 2024 07:23:02 GMT",
            "request-context": "appId=cid-v1:e2e09586-abb7-42cd-915f-0bdb17837cee",
            "server": "cloudflare",
            "vary": "Accept-Encoding",
            "x-aspnet-version": "4.0.30319",
            "x-aspnetmvc-version": "5.2",
            "x-content-type-options": "nosniff",
            "x-download-options": "noopen",
            "x-powered-by": "ASP.NET",
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-length": "79",
            "content-type": "application/json",
            "cookie": ".ASPXANONYMOUS=j86Q8EI2DSJpS6d7KCWYHlia_73j4KAIQoGX1TfrZerL6z7TWMSjz1Dd_SqxEYCrR_F8HAadve2ODKPPEgl9ZP2mHK3wQcpu8ucZ-5Vvcb7Mo5rsU-2vBk1UJ4Dnq-3uKsvJi5sJc6Ke8Nu2s25-Uw2; EPi:StateMarker=true; EPi:StartUrlKey=https://www.chefswarehouse.com/products/dairy-and-eggs/dairy-products/; PROD_cwUserData=g+6+DtLGpn3CKyy95hUiAuQL0XAMfZkNSJyKhyqDIXd6/i9zi0RxZHlY9G2fNAcNoAUWBGh+zVZHiPt2XA67NZZuT0lzzSNApLEPKYUFh0zeKfyujSqFub5fTaer9YYie8ZBdyszAVOBdb2EQB7D7di+02PfL0ixHwJ5e+9W1EejLXbbUuNTRWFUw8mOOlyVANGw90P2bBQAd11AeUkvVX2JEyKxTtqM8O/wOwahQVz142sYZupSp5N6wkcYMyAl9lhWwfK4/ACmQitlLzn6OxaaSDza/9IDBNPCtrUjnhEU7f989WKmaG/dp+cA3MJRaYXtpDIyE0SBYWnx4xoGGV1hYo2yUBlTvs10PRNhajWrCW1GTo1PVyzy0SkRrMRNWyIRGqM6bWhoU4Z5juwvezbCIXLG1JfLLIrc8LELGSpems4ox+ehfC3tz7I/OJI+a5r+l8I5MDj2XqS1lujLlMTSVyd/L3oROZzU3drQ/rj5qS4zsmS3xvlzNm34hj/jOWahpDFkJ/rJPvcrJCTtJuXkbnvDdr8hH7vZ9DFgti01oWJxlZbGet+8URGFZrcFr6hmT2XIrsv+dWurKGtQ3mjj+BK4GQcwdV3S4V5knxLsS0BFnqSU3lHmV2o/dtI4IrEGY3dS7xZcxKsPv5xR1SA1YDHdLd/MwhBUKTKnfpTxCOOp7PhIzjiYtBaGEsD4ZIOoycJtS+D5rFfM8vKj/kA4yM3QzNDtalxEm8zkI9aS1eKvU8B5P0/X56viZ2ehTj4q1sMZ2yebT5UmEA3hxXX90uTkMza/7yS/Q6PmhMIV7laRIEAP8R+V9BjgnG6ihz+nvPgbp2i//pmm0uFD43FkRUB8YsVvvzAy7c3J9mI5Mhp/n01IL/2XjSuWhwihMCiXzKanExKwsoqV3D67ZNVYvcxEPFuq5e7WTjaWJg5zGyF+PIxna3UMZBgfRjdgAy7eTizkedA/2jF0c+NWMPH9f+J1v8I58vxJ5kE/R5PekwXoWma2jStdq5kZVUaCy8iqusXlwgJZZj9zTToG72QxysM7LnKkez9UTUZofvfvgtYSiO0aZbgvOfpPsJcCBDr3xJ50rmJiqkqtCcuyqyUcEVAsIQ+636faWBTQpbVxEpM687YN6txD/fCzYOI6fASwt642d21pMBdVJ9ZLf8SjnvwBOkI1ANgHfzQaAi6cqrHa6sp3ja0FSXw6hWFS5it0q/D9DJh3x8bbnFrKxcsYi1OtxLF7nWhXIi0CP9JsIl7ULKpqvN3DJ1eFexDgBOAAwM66wa71Auf7HtJ+JQ==; ARRAffinity=8feb9febfc599157ea6127e82202f2e98b6daa66ed20d2500672e20f7d969513; ARRAffinitySameSite=8feb9febfc599157ea6127e82202f2e98b6daa66ed20d2500672e20f7d969513; optimizelyEndUserId=oeu1725002177471r0.7066018870918853; ai_user=jbsbo|2024-08-30T07:16:17.909Z; ai_session=gcwU8|1725002178980|1725002556933.5",
            "origin": "https://www.chefswarehouse.com",
            "priority": "u=1, i",
            "referer": "https://www.chefswarehouse.com/products/dairy-and-eggs/dairy-products/",
            "request-id": "|ri2I3.xGi0X",
            "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
};

const fetchAllProducts = async () => {
    while (hasMoreData) {
        const data = await fetchProducts(start);
        if (data && data.results) {
            allData = allData.concat(data.results);
            start = start+1;
            console.log(start);
            
            console.log(data.results.length,pageSize ,start,);
            

            // Check if there are more pages
            hasMoreData = data.results.length === pageSize;
        } else {
            hasMoreData = false;
        }
    }

    // Save all data to a file
    try {
        await fs.writeFile('dairyProducts.json', JSON.stringify(allData, null, 2));
        console.log('Data saved to productsData.json');
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

fetchAllProducts();
