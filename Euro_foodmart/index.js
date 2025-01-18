const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const MAX_RETRIES = 3;
  const START_PAGE = 2; // Start from page 9 due to previous error
  const FILE_NAME = "Personal Care.json";

  // Load existing data to avoid duplicates
  let existingProducts = [];
  if (fs.existsSync(FILE_NAME)) {
    const fileContents = fs.readFileSync(FILE_NAME, "utf8");
    if (fileContents) {
      existingProducts = JSON.parse(fileContents);
    }
  }
  const processedSkus = new Set(existingProducts.map((prod) => prod.sku));

  const initializeBrowser = async () => {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // Path to Chrome on macOS
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    return { browser, page };
  };

  let { browser, page } = await initializeBrowser();
  let currentPage = START_PAGE;

  while (true) {
    // Run until an empty page is found
    const pageUrl =
      currentPage === 1
        ? "https://eurofoodmart.com/collections/personal-care"
        : `https://eurofoodmart.com/collections/personal-care?page=${currentPage}`;

    console.log(`Collecting product data from page ${currentPage}: ${pageUrl}`);

    try {
      await page.goto(pageUrl, { waitUntil: "networkidle2" });
      await page.waitForSelector("div.product-item__inner", { timeout: 30000 });

      const productData = await page.evaluate(() => {
        const products = document.querySelectorAll("div.product-item__inner");
        return Array.from(products).map((product) => {
          const name =
            product
              .querySelector("h3.product-item__product-title a")
              ?.innerText.trim() || "N/A";
          const price =
            product
              .querySelector("span.product-item__price-main span")
              ?.innerText.trim() || "N/A";
          const productUrl =
            product.querySelector("a.product-item__image-link")?.href || "N/A";
          const imageUrl =
            product.querySelector("div.product-item__media img.image__img")
              ?.src || "N/A";
          const brand =
            product
              .querySelector("span.product__vendor-prefix + a")
              ?.innerText.trim() || "N/A";

          return { name, price, productUrl, imageUrl, brand };
        });
      });

      if (productData.length === 0) {
        console.log(
          `No products found on page ${currentPage}. Ending pagination.`
        );
        break;
      }

      for (let product of productData) {
        if (processedSkus.has(product.name)) {
          console.log(`Duplicate product detected: ${product.name}. Skipping.`);
          continue;
        }

        let retries = 0;
        let success = false;

        while (retries < MAX_RETRIES && !success) {
          try {
            console.log(
              `Navigating to product page for ${product.name} (Attempt ${
                retries + 1
              })`
            );
            await page.goto(product.productUrl, { waitUntil: "networkidle2" });
            await page.waitForSelector(
              "h1.product__title.ff-heading.fs-heading-2-base",
              { timeout: 30000 }
            );

            const specifications = await page.evaluate(() => {
              const name =
                document
                  .querySelector(
                    "h1.product__title.ff-heading.fs-heading-2-base"
                  )
                  ?.innerText.trim() || "N/A";
              const price =
                document
                  .querySelector("div.product__price span[data-price]")
                  ?.innerText.trim() || "N/A";
              // Select the paragraph inside the specified container
              const description = 
              document.querySelector("div.truncate-wrapper__content p")?.innerText.trim() ||
              document.querySelector("div.truncate-wrapper__content.rte.non-page-rte")?.innerText.trim() || 
              'N/A';
            
            console.log(description);
            
            // const description = 

              console.log(description);

              const imageUrl =
                document.querySelector(
                  "div.image.animation--image img.image__img" 
                )?.src || "N/A";
              const brand =
                document
                  .querySelector("div.product__vendor.fs-body-100 a")
                  ?.innerText.trim() || "N/A";
              const contentUrl = window.location.href;
              return { name, price, description, imageUrl, brand, contentUrl };
            });

            product.specifications = specifications;
            success = true;
          } catch (error) {
            console.error(
              `Error fetching specifications for ${product.name}: ${error.message}`
            );
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before retrying
          }
        }

        if (!success) {
          console.log(
            `Failed to fetch specifications for ${product.name} after ${MAX_RETRIES} attempts.`
          );
          product.specifications = {};
        }

        // Track processed products to avoid duplicates
        processedSkus.add(product.name);
        existingProducts.push(product);
        console.log(`Product data for ${product.name} saved temporarily.`);
      }

      // Save product data to JSON file once per page
      fs.writeFileSync(
        FILE_NAME,
        JSON.stringify(existingProducts, null, 2),
        "utf8"
      );
      console.log(`Page ${currentPage} saved to ${FILE_NAME}.`);
    } catch (error) {
      console.error(`Error on page ${currentPage}: ${error.message}`);
      currentPage++; // Move to the next page in case of error
      continue;
    }
    currentPage++; // Move to the next page
  }

  console.log(`Scraping complete.`);
  await browser.close();
})();
