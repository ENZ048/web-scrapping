const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const URL = "https://www.amazon.in/s?k=mobile+under+50000&crid=M8V165HCO0DY&sprefix=mobile+under+50000%2Caps%2C250&ref=nb_sb_noss_1";

async function scrapeProducts() {
  try {
    const response = await axios.get(URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/112.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    fs.writeFileSync("productPage.html", response.data, "utf-8");

    const html = fs.readFileSync("productPage.html", "utf-8");
    const $ = cheerio.load(html);

    const products = [];

    $("div[data-uuid]").each((index, element) => {
      const name = $(element).find("h2 > span").text().trim();
      const price = $(element).find(".a-price-whole").text().trim();
      const rating = $(element).find(".a-icon-alt").text().trim();

      products.push({
        Name: name || "N/A",
        Price: price || "N/A",
        Rating: rating || "N/A",
      });
    });

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(products);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Products");
    xlsx.writeFile(workbook, "ProductData.xlsx");

    console.log("Data Extracted Successfully!");

  } catch (err) {
    console.error("Error:", err.message);
  }
}

scrapeProducts();
