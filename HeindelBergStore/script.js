const axios = require('axios');
const fs = require('fs'); // Require the filesystem module to write files

const baseUrl = 'https://heidelberg.storefronts.site/search.json';
const params = {
  page: 1,
  per_page: 100,
  sort: 'score',
  direction: 'desc',
  product_type: [5],
};

async function fetchPage(page) {
  try {
    // Update the page number in the query parameters
    const response = await axios.get(baseUrl, {
      params: { ...params, page },
    });
    return response.data; // Return the full response data
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    throw error;
  }
}

async function fetchAllData() {
  let allData = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    while (currentPage <= totalPages) {
      console.log(`Fetching page ${currentPage}...`);
      const data = await fetchPage(currentPage);

      // Add data to the result array
      allData = allData.concat(data.results || []); // Store the `results` array from the response

      // Use the `meta` object to get total pages
      totalPages = data.meta?.total_pages || 1;

      // Increment the page number to fetch the next one
      currentPage++;
    }

    console.log(`Fetched a total of ${allData.length} products.`);

    // Write the fetched data to a JSON file
    fs.writeFileSync('spirits.json', JSON.stringify(allData, null, 2), 'utf-8');
    console.log('Data has been written to products.json');
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchAllData();
