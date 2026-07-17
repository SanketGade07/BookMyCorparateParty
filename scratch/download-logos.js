const fs = require("fs");
const path = require("path");
const https = require("https");

const logoDomains = [
  { name: "ibm", domain: "ibm.com" },
  { name: "maersk", domain: "maersk.com" },
  { name: "codvo", domain: "codvo.ai" },
  { name: "wtw", domain: "wtwco.com" },
  { name: "accenture", domain: "accenture.com" },
  { name: "rxo", domain: "rxo.com" },
  { name: "cdsl", domain: "cdslindia.com" },
  { name: "intuit", domain: "intuit.com" },
  { name: "hafele", domain: "hafele.com" },
  { name: "bni", domain: "bni.com" },
  { name: "wework", domain: "wework.com" },
  { name: "jsw", domain: "jsw.in" },
  { name: "guidepoint", domain: "guidepoint.com" },
  { name: "suryoday", domain: "suryodaybank.com" },
  { name: "seedglobal", domain: "seedglobaleducation.com" },
  { name: "synergy", domain: "synergygroup.sg" },
  { name: "neo", domain: "neogrowth.in" },
  { name: "concorde", domain: "concorde.co" }
];

const outputDir = path.join(__dirname, "../public/images/logos");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirect
        downloadImage(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Status: ${res.statusCode}`));
        return;
      }
      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        fs.writeFileSync(dest, Buffer.concat(data));
        resolve();
      });
    }).on("error", reject);
  });
}

async function start() {
  console.log("Starting logo downloads with https module...");
  for (const item of logoDomains) {
    const url = `https://logo.clearbit.com/${item.domain}`;
    const dest = path.join(outputDir, `${item.name}.png`);
    try {
      await downloadImage(url, dest);
      console.log(`Successfully downloaded ${item.name} logo`);
    } catch (err) {
      console.error(`Failed to download ${item.name} from ${url}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log("All logo downloads finished.");
}

start();
