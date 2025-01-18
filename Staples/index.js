const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const baseURL = "https://www.staples.com/deals/candy-gum-and-mints/BI1919975";
  const outputFileName = "staples-candy-gum-and-mints.json";
  const allProductData = [];
  let currentPageNumber = 1;

  try {
    let nextPageAvailable = true;
    while (nextPageAvailable) {
      const currentPageURL = `${baseURL}?pn=${currentPageNumber}`;
      console.log(`Navigating to page: ${currentPageURL}`);

      let retries = 3;
      while (retries > 0) {
        try {
          await page.goto(currentPageURL, { waitUntil: "networkidle2", timeout: 0 });
          await page.waitForTimeout(3000);

          // Perform multiple scroll actions to load all products
          let previousHeight;
          while (true) {
            previousHeight = await page.evaluate("document.body.scrollHeight");
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
            await page.waitForTimeout(2000);

            const newHeight = await page.evaluate("document.body.scrollHeight");
            if (newHeight === previousHeight) {
              break;
            }
          }

          // Wait for the product tiles to be loaded
          await page.waitForSelector("div.standard-tile__badge_image_holder", { timeout: 15000 });
          break;
        } catch (err) {
          console.warn(`Attempt ${4 - retries} failed. Retrying...`);
          retries--;

          if (retries === 0) {
            console.error("No products found after multiple retries. Exiting pagination.");
            return;
          }
        }
      }

      // Extract product links
      const productLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.standard-tile__badge_image_holder a")
        ).map((el) => el.href);
      });
      console.log(`Found ${productLinks.length} products on this page.`);

      // Loop through each product link and extract details
      for (const productLink of productLinks) {
        console.log(`Scraping product: ${productLink}`);
        try {
          await page.goto(productLink, {
            waitUntil: "domcontentloaded",
            timeout: 0,
          });

          const productData = await page.evaluate(() => {
            const getText = (selector) => {
              return document.querySelector(selector)?.innerText.trim() || "";
            };
            const getAttribute = (selector, attribute) => {
              return (
                document.querySelector(selector)?.getAttribute(attribute) || ""
              );
            };

            const name = getText("#product_title");
            const sku = getText("#item_number");
            const price = getText(".price-info__final_price_sku span[aria-hidden='true']");
            const size = getText(".price-info__uom");
            const unit_price = getText(".price-info__ppu");
            const description = Array.from(
              document.querySelectorAll(".product-details-summary__product_summary_bullets li span")
            )
              .map((el) => el.innerText.trim())
              .join(" ");

            const image_url = getAttribute("div.sc-vxwfqr-3 img", "src");
            const fallbackImageURL = getAttribute("img[aria-hidden='true']", "src");
            const finalImageURL = image_url || fallbackImageURL || "No Image URL Found";

            return {
              name,
              sku,
              price,
              size,
              unit_price,
              description,
              image_url: finalImageURL,
            };
          });

          allProductData.push({ ...productData, url: productLink });
        } catch (err) {
          console.error(`Error scraping product ${productLink}: ${err.message}`);
        }
      }

      const isNextPageDisabled = await page.evaluate(() => {
        const nextButton = document.querySelector("a.sc-1npzh55-3.epkeou");
        return nextButton
          ? nextButton.getAttribute("aria-disabled") === "true"
          : true;
      });

      if (isNextPageDisabled) {
        console.log("No more pages available.");
        nextPageAvailable = false;
      } else {
        currentPageNumber++;
        await page.waitForTimeout(2000);
      }
    }

    fs.writeFileSync(outputFileName, JSON.stringify(allProductData, null, 2));
    console.log(`Scraping completed. Data saved to ${outputFileName}`);
  } catch (error) {
    console.error("Error while scraping:", error.message);
  } finally {
    await browser.close();
  }
})();
