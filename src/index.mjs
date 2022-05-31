import scrape from "website-scraper";
import PuppeteerPlugin from "website-scraper-puppeteer";
import { replaceStringInFiles } from "tiny-replace-files";
import fs from "fs";

// Website URL
const websiteUrl = "https://webflow.website.url";

// Exported files directory
const filesDirectory = "public";

main();

async function main() {
  // Download website files
  await scrape({
    urls: [websiteUrl],
    directory: filesDirectory,
    plugins: [new PuppeteerPlugin()],
  });

  // Fix cross origin issues
  var options = {
    files: `${filesDirectory}/index.html`,
    from: 'crossorigin="anonymous"',
    to: '',
  };

  await replaceStringInFiles(options);

  // Hide 'Made with WebFlow' notice

 const jsFiles = fs.readdirSync(`./${filesDirectory}/js`, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);

    const webflowJsFile = jsFiles.find(file => file.includes("webflow"));

  options = {
    files: `./${filesDirectory}/js/${webflowJsFile}`,
    from: 'shouldBrand && !isPhantom',
    to: 'false',
  };

 await replaceStringInFiles(options);

  console.log(`Website extracted to ${filesDirectory}/index.html`);
}
