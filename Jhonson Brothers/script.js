import fs from 'fs';
    import fetch from 'node-fetch';

let page = 1;  // Start with the first page
const per_page = 100;
const jsonData = [];
async function fetchSingleIds(baseUrl) {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();

        // Extract the IDs and add them to the array
        // const ids = data?.products.map(product => product?.id);
        jsonData.push(...data?.results)
        

        // Check if more pages are available
        if (data?.results.length === per_page) {
            page++;
            console.log(page)
            const nextPageUrl = `https://johnsonbrothers.storefronts.site/search.json?page=${page}&per_page=100&sort=score&direction=desc&zone_id=682`
            await fetchSingleIds(nextPageUrl);
        } else {
            console.log("All pages fetched");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

(async () => {
    const url = `https://johnsonbrothers.storefronts.site/search.json?page=${page}&per_page=100&sort=score&direction=desc&zone_id=682`
    await fetchSingleIds(url);

    // Save the array of IDs to a JSON file
    fs.writeFileSync('florida.json', JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log("All IDs:", jsonData);
    console.log("Data saved to ids.json");
})();