const url = "https://www.instagram.com/p/Da4g1-9C_Fr/";
console.log("Fetching post HTML with Facebook Crawler User-Agent...");
fetch(url, {
  headers: {
    "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_voiced_ostg.html)"
  }
})
  .then(res => res.text())
  .then(text => {
    console.log("HTML length:", text.length);
    
    // Search for og:image
    const match = text.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                  text.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (match) {
      console.log("Found og:image:", match[1]);
    } else {
      console.log("og:image not found.");
      // Search for any meta tags
      const metas = [];
      const regex = /<meta[^>]+>/g;
      let m;
      while ((m = regex.exec(text)) !== null) {
        metas.push(m[0]);
      }
      console.log("Sample meta tags:\n", metas.slice(0, 15).join("\n"));
    }
  })
  .catch(err => {
    console.error("Error:", err);
  });
