import fetch from 'node-fetch';
import fs from 'fs';

// Define the base URL and the headers
const baseUrl = 'https://order.gfs.com/us-central1/api/v2/materials/category';
const headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en_US",
    "Cookie": "rxVisitor=172500139767755R4S8PT5880704G84BS7QLKJTFCQQ0C; _swb=c762ca91-da21-4dde-be2a-d6d498842354; _ketch_consent_v1_=eyJhbmFseXRpY3MiOnsic3RhdHVzIjoiZ3JhbnRlZCIsImNhbm9uaWNhbFB1cnBvc2VzIjpbImFuYWx5dGljcyJdfSwiYmVoYXZpb3JhbF9hZHZlcnRpc2luZyI6eyJzdGF0dXMiOiJncmFudGVkIiwiY2Fub25pY2FsUHVycG9zZXMiOlsiYmVoYXZpb3JhbF9hZHZlcnRpc2luZyJdfSwiZXNzZW50aWFsX3NlcnZpY2VzIjp7InN0YXR1cyI6ImdyYW50ZWQiLCJjYW5vbmljYWxQdXJwb3NlcyI6WyJlc3NlbnRpYWxfc2VydmljZXMiXX19; gordonNow_ga=GA1.1.1102499164.1725001409; dtCookie=v_4_srv_6_sn_22E15FB732A97569D1C2E3D07FAD7DE5_perc_23161_ol_1_app-3A77f2132031842be3_0; GOR=us-central1; GCLB=CNSjoY3Ls4TYYxAD; _lr_uf_-fwixe9=e2c310cc-4164-4591-981d-fe5bc8f8dfe7; BIGipServerpool_nutritionService.gfs.com=1713693450.11571.0000; _gid=GA1.2.222323097.1725344759; TS014b3d87=016aece3b3f35512156fdb29587f1ad72e6a17f8fa931819da9cde709811083eb23aa0782191de8f87522a939b741410476cb1cc85; _gcl_au=1.1.930183736.1725434058; _swb_consent_=eyJvcmdhbml6YXRpb25Db2RlIjoiZ2ZzIiwicHJvcGVydHlDb2RlIjoidXNfZGlzdHJpYnV0aW9uIiwiZW52aXJvbm1lbnRDb2RlIjoicHJvZHVjdGlvbiIsImp1cmlzZGljdGlvbkNvZGUiOiJkZWZhdWx0IiwiaWRlbnRpdGllcyI6eyJzd2JfdXNfZGlzdHJpYnV0aW9uIjoiYzc2MmNhOTEtZGEyMS00ZGRlLWJlMmEtZDZkNDk4ODQyMzU0In0sInB1cnBvc2VzIjp7ImFuYWx5dGljcyI6eyJsZWdhbEJhc2lzQ29kZSI6ImRpc2Nsb3N1cmUiLCJhbGxvd2VkIjoidHJ1ZSJ9LCJiZWhhdmlvcmFsX2FkdmVydGlzaW5nIjp7ImxlZ2FsQmFzaXNDb2RlIjoiZGlzY2xvc3VyZSIsImFsbG93ZWQiOiJ0cnVlIn0sImVzc2VudGlhbF9zZXJ2aWNlcyI6eyJsZWdhbEJhc2lzQ29kZSI6ImRpc2Nsb3N1cmUiLCJhbGxvd2VkIjoidHJ1ZSJ9fSwiY29sbGVjdGVkQXQiOjE3MjU0MzQwNTl9; _ga=GA1.1.507707986.1725001361; XSRF-TOKEN=9fa1b8fe-7ea7-46ec-b311-c4c0040c0c54; __Secure-GORDONORDERING2=YmEwNjk1MjgtMDAwMC00ZDEzLWFjNmYtNDcwOGMyNzVkNTkw; _lr_hb_-fwixe9%2Fnaoo-prd={%22heartbeat%22:1725434118125}; gordonNow_ga_CK5L5XCGJN=GS1.1.1725433521.6.1.1725434123.60.0.0; _ga_X3LJM7Z737=GS1.1.1725433053.6.1.1725434130.48.0.0; _lr_tabs_-fwixe9%2Fnaoo-prd={%22sessionID%22:0%2C%22recordingID%22:%225-04a7610d-db73-40e0-8c47-cee2c086ad09%22%2C%22webViewID%22:null%2C%22lastActivity%22:1725434135678}",
    "Priority": "u=1, i",
    "Referer": "https://order.gfs.com/categories/results/2~092",
    "Sec-CH-UA": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": "\"Windows\"",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "X-DTPC": "6$434116971_653h128vJQVALVFWPHHHJJHCGHFFVIKFFTUBIJFU-0e0",
    "X-DTReferer": "https://order.gfs.com/categories/1~A14",
    "X-LogRocket-URL": "https://app.logrocket.com/fwixe9/naoo-prd/s/5-04a7610d-db73-40e0-8c47-cee2c086ad09/0/255a75c8-9e70-4a5e-a34a-0f67fd644fbc?t=1725434126599",
    "X-Requested-With": "XMLHttpRequest",
    "X-XSRF-TOKEN": "9fa1b8fe-7ea7-46ec-b311-c4c0040c0c54"
};



// Function to fetch all materials with pagination
async function fetchAllMaterials() {
    let allMaterials = [];
    let searchOffset = 0;
    const resultsLimit = 50;
    let hasMoreData = true;

    while (hasMoreData) {
        const urlWithParams = `${baseUrl}?categoryCoordinate=2~136&searchOffset=${searchOffset}&resultsLimit=${resultsLimit}`;

        try {
            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text(); // Get the raw response text
            console.log("Raw response:", text); // Log the raw response for debugging

            if (!text) {
                console.error("Received empty response from the API."); // Handle empty response
                return []; // Return an empty array in case of an empty response
            }

            const data = JSON.parse(text); // Parse the response as JSON
            allMaterials.push(...data?.materialNumbers); // Assuming the response has a field materialNumbers

            // Check if more data is available
            hasMoreData = data.materialNumbers.length === resultsLimit;
            searchOffset += resultsLimit; // Increment the offset for the next page
            console.log(searchOffset);
            
        } catch (error) {
            console.error("Error fetching data:", error); // Log the error
            hasMoreData = false; // Stop fetching on error
        }
    }

    return allMaterials; // Return all fetched materials
}

// Function to save data to a JSON file
function saveToFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Data saved to ${filename}`);
}

// Main function to execute the fetch and save
(async () => {
    const materials = await fetchAllMaterials();
    console.log("All materials fetched:", materials);
    
    // Save the fetched materials to a JSON file
    saveToFile('CleaningChemical12.json', materials);
})()