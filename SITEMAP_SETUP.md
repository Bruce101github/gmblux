# Sitemap Setup Guide

## ✅ What I've Created

1. **Dynamic Sitemap Generator** (`client/api/sitemap.xml.js`)
   - Automatically fetches all properties from Supabase
   - Generates sitemap.xml on-the-fly
   - Includes homepage, listings page, and all property pages
   - Updates automatically when properties are added/updated

2. **robots.txt** (`client/public/robots.txt`)
   - Tells search engines where to find your sitemap
   - Allows all pages except admin panel

3. **Vercel Configuration** (`client/vercel.json`)
   - Routes `/sitemap.xml` to the API function
   - Sets proper caching headers

---

## 🚀 How It Works

### For Vercel Deployment:

1. **The sitemap is generated dynamically** when accessed at:
   ```
   https://gmblux.com/sitemap.xml
   ```

2. **It automatically includes:**
   - Homepage (`/`)
   - Listings page (`/listings`)
   - All property pages (`/listing/[id]`)

3. **Updates automatically:**
   - When you add a new property → appears in sitemap
   - When you update a property → lastmod date updates
   - No manual work needed!

---

## 📋 Setup Steps

### Step 1: Deploy to Vercel

The files are already in place. Just push to GitHub and Vercel will deploy:

```bash
git add .
git commit -m "Add dynamic sitemap generator"
git push
```

### Step 2: Verify Sitemap Works

After deployment, test your sitemap:

1. Visit: `https://gmblux.com/sitemap.xml`
2. You should see XML with all your properties
3. Check that property URLs are correct

### Step 3: Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (`gmblux.com`)
3. Go to **Sitemaps** in the left menu
4. Enter: `sitemap.xml`
5. Click **Submit**

### Step 4: Verify robots.txt

1. Visit: `https://gmblux.com/robots.txt`
2. Should see your sitemap location

---

## 🔧 Alternative: Static Sitemap (If API doesn't work)

If the Vercel serverless function doesn't work, you can generate a static sitemap:

### Option A: Manual Script

Create `scripts/generate-sitemap.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Fetch properties from Supabase
const SUPABASE_URL = 'https://swghelvkzagyrwiyvlsd.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

async function generateSitemap() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=id,updated_at`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    
    const properties = await response.json();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gmblux.com/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://gmblux.com/listings</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${properties.map(p => `  <url>
    <loc>https://gmblux.com/listing/${p.id}</loc>
    <lastmod>${p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(
      path.join(__dirname, '../client/public/sitemap.xml'),
      sitemap
    );
    
    console.log('✅ Sitemap generated successfully!');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

generateSitemap();
```

Run: `node scripts/generate-sitemap.js`

### Option B: Build-time Generation

Add to `vite.config.js`:

```javascript
import { defineConfig } from "vite";
// ... other imports

export default defineConfig({
  // ... existing config
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'generate-sitemap',
      buildEnd() {
        // Generate sitemap after build
        generateSitemap();
      }
    }
  ],
});
```

---

## 🧪 Testing

### Test Sitemap Locally:

1. **If using Vercel CLI:**
   ```bash
   cd client
   vercel dev
   ```
   Visit: `http://localhost:3000/sitemap.xml`

2. **Validate XML:**
   - Use [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
   - Or check in browser (should display as formatted XML)

### Test robots.txt:

Visit: `https://gmblux.com/robots.txt`

Should see:
```
User-agent: *
Allow: /

Disallow: /admin

Sitemap: https://gmblux.com/sitemap.xml
```

---

## 📊 Monitoring

### Google Search Console:

1. After submitting sitemap, wait 24-48 hours
2. Check **Coverage** report:
   - Should show all property pages indexed
   - Check for any errors

3. Check **Sitemaps** section:
   - Should show "Success" status
   - Shows number of URLs discovered

---

## 🔄 Keeping Sitemap Updated

### Automatic (Recommended):
- ✅ Dynamic sitemap updates automatically
- ✅ No manual work needed
- ✅ Always includes latest properties

### Manual (If needed):
- Run generation script before deploying
- Or update static sitemap.xml file

---

## 🐛 Troubleshooting

### Problem: Sitemap returns 404
**Solution:**
- Check `vercel.json` is in `client/` directory
- Verify API route is at `client/api/sitemap.xml.js`
- Redeploy on Vercel

### Problem: Sitemap is empty
**Solution:**
- Check Supabase connection
- Verify API key is correct
- Check browser console for errors

### Problem: Properties not in sitemap
**Solution:**
- Check Supabase query returns data
- Verify property IDs are correct
- Check API response in Network tab

---

## 📝 Notes

- **Sitemap updates automatically** - No need to regenerate manually
- **Cached for 1 hour** - Fast response times
- **Fallback included** - Shows static pages if Supabase fails
- **SEO-friendly** - Proper lastmod dates and priorities

---

## ✅ Checklist

- [x] Dynamic sitemap generator created
- [x] robots.txt created
- [x] Vercel configuration added
- [ ] Deploy to Vercel
- [ ] Test sitemap.xml URL
- [ ] Submit to Google Search Console
- [ ] Verify in Search Console after 24-48 hours

