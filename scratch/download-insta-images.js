const fs = require("fs");
const path = require("path");

const postsData = [
  { id: 1, url: "https://www.instagram.com/p/DdbiUCXk3lJ/?img_index=1" },
  { id: 2, url: "https://www.instagram.com/p/DdWTv8QT4pG/" },
  { id: 3, url: "https://www.instagram.com/p/DdMC1OZE-eR/?img_index=1" },
  { id: 4, url: "https://www.instagram.com/p/DdJZm-5zNs_/" },
  { id: 5, url: "https://www.instagram.com/p/Dc8oSx2k97z/?img_index=1" },
  { id: 6, url: "https://www.instagram.com/p/Dc3VD-XDGuX/?img_index=1" },
  { id: 7, url: "https://www.instagram.com/p/DcyeUPgk_yd/?img_index=1" },
  { id: 8, url: "https://www.instagram.com/p/DcqkiDkk-Xz/?img_index=1" },
  { id: 9, url: "https://www.instagram.com/p/Dcn0G6tRoou/" },
  { id: 10, url: "https://www.instagram.com/p/DcYf2QDE0yN/?img_index=1" }
];

const outputDir = path.join(__dirname, "../public/images/instagram");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchPostDetails(postUrl) {
  const response = await fetch(postUrl, {
    headers: {
      "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_voiced_ostg.html)"
    }
  });
  const text = await response.text();

  const imgMatch = text.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                   text.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  const imgUrl = imgMatch ? imgMatch[1].replace(/&amp;/g, "&") : null;

  const descMatch = text.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  let caption = "";
  let likes = "450";

  if (descMatch) {
    const desc = descMatch[1]
      .replace(/&quot;/g, '"')
      .replace(/&#x2019;/g, "'")
      .replace(/&#x2122;&#xfe0f;/g, "™")
      .replace(/&amp;/g, "&");

    // Extract likes count if present (e.g. "45 likes, 2 comments...")
    const likesMatch = desc.match(/^([0-9,KM]+)\s+likes/i);
    if (likesMatch) {
      likes = likesMatch[1];
    }

    // Extract caption text after the colon and quotes
    const quoteMatch = desc.match(/:\s*["“](.+?)["”]/s);
    if (quoteMatch) {
      caption = quoteMatch[1].split("\n")[0].trim();
    } else {
      caption = desc.split("\n")[0].trim();
    }
  }

  return { imgUrl, caption: caption || "Corporate celebration with BookMyCorporateParty", likes };
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
}

async function start() {
  console.log("Starting Instagram image downloader & updater...");
  const results = [];
  
  for (const post of postsData) {
    console.log(`Processing post ${post.id}: ${post.url}...`);
    try {
      const details = await fetchPostDetails(post.url);
      if (details.imgUrl) {
        const filename = `post-${post.id}.jpg`;
        const dest = path.join(outputDir, filename);
        await downloadImage(details.imgUrl, dest);
        console.log(`Saved: ${filename}`);

        results.push({
          img: `/images/instagram/${filename}`,
          alt: details.caption.slice(0, 60),
          postUrl: post.url,
          likes: details.likes,
          caption: details.caption
        });
      } else {
        console.warn(`Could not find image for post ${post.id}`);
      }
    } catch (error) {
      console.error(`Error processing post ${post.id}:`, error.message);
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 600));
  }
  
  console.log("\n Download completed! Updated posts array:\n");
  console.log(JSON.stringify(results, null, 2));
  
  fs.writeFileSync(
    path.join(__dirname, "insta-results.json"),
    JSON.stringify(results, null, 2)
  );
  console.log("\nResults saved to scratch/insta-results.json");
}

start();
