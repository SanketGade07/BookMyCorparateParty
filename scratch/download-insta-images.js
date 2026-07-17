const fs = require("fs");
const path = require("path");

const postsData = [
  { id: 1, url: "https://www.instagram.com/p/Da4g1-9C_Fr/" },
  { id: 2, url: "https://www.instagram.com/p/Da3RlqtDhnq/" },
  { id: 3, url: "https://www.instagram.com/p/DazWpRRJunj/" },
  { id: 4, url: "https://www.instagram.com/p/Das0ZZHi2u0/" },
  { id: 5, url: "https://www.instagram.com/p/DarGk7Vi6uk/" },
  { id: 6, url: "https://www.instagram.com/p/DaqFgHSM_mX/" },
  { id: 7, url: "https://www.instagram.com/p/DapnmrvOL4S/" },
  { id: 8, url: "https://www.instagram.com/p/DamhaERCAyY/" },
  { id: 9, url: "https://www.instagram.com/p/DamOA0NIooe/" },
  { id: 10, url: "https://www.instagram.com/p/DamMBe7oLHI/" }
];

const outputDir = path.join(__dirname, "../public/images/instagram");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchOgImage(postUrl) {
  const response = await fetch(postUrl, {
    headers: {
      "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_voiced_ostg.html)"
    }
  });
  const text = await response.text();
  const match = text.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                text.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (match) {
    // Unescape HTML entities in URL (e.g. &amp; -> &)
    return match[1].replace(/&amp;/g, "&");
  }
  return null;
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
}

async function start() {
  console.log("Starting Instagram image downloader...");
  const results = [];
  
  for (const post of postsData) {
    console.log(`Processing post ${post.id}: ${post.url}...`);
    try {
      const cdnUrl = await fetchOgImage(post.url);
      if (cdnUrl) {
        console.log(`Found image CDN URL: ${cdnUrl.slice(0, 80)}...`);
        const filename = `post-${post.id}.jpg`;
        const dest = path.join(outputDir, filename);
        await downloadImage(cdnUrl, dest);
        console.log(`Successfully saved to ${dest}`);
        results.push({ id: post.id, localPath: `/images/instagram/${filename}` });
      } else {
        console.warn(`Could not find og:image for post ${post.id}`);
      }
    } catch (error) {
      console.error(`Error processing post ${post.id}:`, error.message);
    }
    // Small delay to avoid hammering Instagram
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("Download completed! Results:", results);
  
  // Write result mapping to a file so we can update InstagramWidget.tsx
  fs.writeFileSync(
    path.join(__dirname, "insta-results.json"),
    JSON.stringify(results, null, 2)
  );
}

start();
