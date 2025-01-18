// const puppeteer = require("puppeteer");
// const fs = require("fs");

// async function extractProductDetails() {
//   // console.log("Launching browser...");
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   // page.on("console", (msg) => //console.log("PAGE LOG:", msg.text()));

//   // console.log("Navigating to product listing page...");
//   await page.goto("https://www.bittersandbottles.com/collections/spirits", {
//     waitUntil: "networkidle2",
//   });

//   // console.log("Waiting for product items to load...");
//   await page.waitForSelector(
//     "li.productgrid--item.imagestyle--natural.productitem--sale"
//   );

//   // console.log("Extracting product links...");
//   const productLinks = await page.evaluate(() => {
//     return Array.from(
//       document.querySelectorAll("a.productitem--image-link")
//     ).map((link) => link.href);
//   });

//   // console.log(`Found ${productLinks.length} product links.`);
//   fs.writeFileSync("productLinks.json", JSON.stringify(productLinks, null, 2));

//   const productData = [];
//   const productPage = await browser.newPage();

//   for (let [index, link] of productLinks.entries()) {
//     try {
//       // console.log(
//       //   `Navigating to product page ${index + 1} of ${
//       //     productLinks.length
//       //   }: ${link}`
//       // );
//       await productPage.goto(link, { waitUntil: "networkidle2" });

//       // console.log("Extracting product details...");
//       const productDetails = await productPage.evaluate(() => {
//         const product = {};

//         // console.log("Extracting product title...");

//         const titleElement = document.querySelector("h1.product-title");
//         product.title = titleElement ? titleElement.innerText.trim() : "N/A";

//         // console.log("Extracting product description...");

//         const descriptionElement = document.querySelector(
//           ".product-description"
//         );
//         product.description = descriptionElement
//           ? descriptionElement.innerText.trim()
//           : "N/A";

//         // console.log("Extracting product price...");

//         const priceElement = document.querySelector(".price--main .money");
//         product.price = priceElement ? priceElement.innerText.trim() : "N/A";

//         // console.log("Extracting product image URL...");

//         const imageElement = document.querySelector(
//           ".product-gallery--media img"
//         );
//         product.imageUrl = imageElement ? imageElement.src : "N/A";

//         // console.log("Extracting vendor information...");

//         const vendorElement = document.querySelector(".product-vendor a");
//         product.vendor = vendorElement ? vendorElement.innerText.trim() : "N/A";

//         // console.log("Extracting variant details...");

//         const variantElement = document.querySelector(
//           ".variant-selector .option-value"
//         );
//         product.variant = variantElement
//           ? variantElement.innerText.trim()
//           : "N/A";

//         // console.log("Extracting product size...");

//         let size = "N/A";
//           const sizeSelectElement = document.querySelector("select.form-field-select");
//           if (sizeSelectElement) {
//             // Find the selected option within the select element
//             const selectedOption = sizeSelectElement.querySelector("option[selected]");
//             size = selectedOption ? selectedOption.innerText.trim() : "N/A";
//           }

//           product.size = size;
//         return product;
//       });

//       productDetails.contentUrl = link;
//       productData.push(productDetails);
//       // console.log(
//       //   `Successfully extracted product details for: ${productDetails.title}`
//       // );
//     } catch (err) {
//       // console.error(`Error extracting data from ${link}:`, err);
//     }
//   }

//   // console.log("Closing product page...");
//   await productPage.close();

//   // console.log("Saving extracted product data to file...");
//   fs.writeFileSync("productData.json", JSON.stringify(productData, null, 2));
//   // console.log(`Extracted product details for ${productData.length} products.`);

//   // console.log("Closing browser...");
//   await browser.close();
// }

// extractProductDetails().catch((err) => {
//   // console.error("Error extracting product details:", err);
// });
const puppeteer = require("puppeteer");
const fs = require("fs");

async function extractProductDetails() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    let hasNextPage = true;
    const productLinks = [];
    let currentPage = 1;

    // Load previously saved product links if available
    if (fs.existsSync("cockatilsLinks.json")) {
      const savedLinks = JSON.parse(fs.readFileSync("cockatilsLinks.json"));
      productLinks.push(...savedLinks);
    }

    while (hasNextPage) {
      try {
        await page.goto(`https://www.bittersandbottles.com/collections/bar-supplies?page=${currentPage}`, {
          waitUntil: "networkidle2",
        });

        await page.waitForSelector("li.productgrid--item", { timeout: 60000 });

        const links = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll("a.productitem--image-link")
          ).map((link) => link.href);
        });

        productLinks.push(...links);
        fs.writeFileSync("productLinks.json", JSON.stringify(productLinks, null, 2)); // Save progress

        hasNextPage = await page.evaluate(() => {
          const nextButton = document.querySelector(".pagination__next a.pagination__item--link");
          return nextButton !== null;
        });

        if (hasNextPage) {
          currentPage++;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (err) {
        console.error(`Error on page ${currentPage}:`, err);
        hasNextPage = false; // Stop if there's an error loading the page
      }
    }

    const productData = [];
    let productPage = await browser.newPage();

    // Load previously saved product data if available
    if (fs.existsSync("productData.json")) {
      const savedData = JSON.parse(fs.readFileSync("productData.json"));
      productData.push(...savedData);
    }

    // Extract only the links that haven't been processed yet
    const alreadyProcessedLinks = productData.map((product) => product.contentUrl);
    const linksToProcess = productLinks.filter((link) => !alreadyProcessedLinks.includes(link));

    for (let [index, link] of linksToProcess.entries()) {
      try {
        console.log(`Navigating to product page ${index + 1} of ${linksToProcess.length}: ${link}`);
        await retryPageGoto(productPage, link);

        if (productPage.isClosed()) {
          productPage = await browser.newPage(); // Reopen the page if it was closed
          await retryPageGoto(productPage, link);
        }

        const productDetails = await productPage.evaluate(() => {
          const product = {};

          const titleElement = document.querySelector("h1.product-title");
          product.title = titleElement ? titleElement.innerText.trim() : "N/A";

          const descriptionElement = document.querySelector(".product-description");
          product.description = descriptionElement
            ? descriptionElement.innerText.trim()
            : "N/A";

          const priceElement = document.querySelector(".price--main .money");
          product.price = priceElement ? priceElement.innerText.trim() : "N/A";

          const imageElement = document.querySelector(".product-gallery--media img");
          product.imageUrl = imageElement ? imageElement.src : "N/A";

          const vendorElement = document.querySelector(".product-vendor a");
          product.vendor = vendorElement ? vendorElement.innerText.trim() : "N/A";

          const variantElement = document.querySelector(".variant-selector .option-value");
          product.variant = variantElement ? variantElement.innerText.trim() : "N/A";

          let size = "N/A";
          const sizeSelectElement = document.querySelector("select.form-field-select");
          if (sizeSelectElement) {
            const selectedOption = sizeSelectElement.querySelector("option[selected]");
            size = selectedOption ? selectedOption.innerText.trim() : "N/A";
          }

          product.size = size;
          return product;
        });

        productDetails.contentUrl = link;
        productData.push(productDetails);
        fs.writeFileSync("Bar supplies.json", JSON.stringify(productData, null, 2)); // Save progress

        console.log(`Successfully extracted product details for: ${productDetails.title}`);
      } catch (err) {
        console.error(`Error extracting data from ${link}:`, err);
      }
    }

    await productPage.close();
  } catch (err) {
    console.error("Error during extraction process:", err);
  } finally {
    await browser.close();
  }
}

async function retryPageGoto(page, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: "networkidle2" });
      return; // Exit if successful
    } catch (err) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, err);
      if (i === retries - 1) throw err; // Throw error if all retries fail
    }
  }
}

extractProductDetails().catch((err) => {
  console.error("Error extracting product details:", err);
});




