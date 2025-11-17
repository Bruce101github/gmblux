# Social Media Image Troubleshooting Guide

## ✅ Your Setup is Correct!

Your Supabase image URL works in the browser:
```
https://swghelvkzagyrwiyvlsd.supabase.co/storage/v1/object/public/property_images/1760377092123-484943436_18035503268624673_7942528685923439779_n.jpg
```

This means:
- ✅ Supabase storage is public
- ✅ Image URL format is correct
- ✅ Code is handling it correctly (uses absolute URL directly)

## 🔍 Why Images Might Not Show on Social Media

### 1. **Social Media Caching (Most Common)**

Social platforms cache images and meta tags aggressively. Even if you fix the code, they might still show old cached data.

**Solution:** Use platform debuggers to force refresh:

#### Facebook/WhatsApp:
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your property URL: `https://gmblux.com/listing/[property-id]`
3. Click **"Scrape Again"** button
4. This forces Facebook to re-fetch and clear cache
5. Check the preview - image should appear

#### Twitter/X:
**Note:** Twitter removed their card validator tool. Use these alternatives:

**Option 1: Test by Sharing**
- Share the property link on Twitter/X
- Check if the image preview appears in the tweet

**Option 2: Use Third-Party Tools**
- **Meta Tags.io**: https://metatags.io/
  - Enter your property URL
  - Check the Twitter Card preview
- **Social Share Preview**: https://socialsharepreview.com/
  - Enter your URL
  - See preview for multiple platforms including Twitter

**Option 3: Check Meta Tags Manually**
- View page source on your property page
- Look for `twitter:image` meta tag
- Verify it contains your Supabase image URL

#### LinkedIn:
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter your property URL
3. Click "Inspect"
4. Check the preview

### 2. **Verify Meta Tags Are Set**

To check if meta tags are correct:

1. **Open a property page** (e.g., `https://gmblux.com/listing/[id]`)
2. **View page source** (Right-click → View Page Source)
3. **Search for** `og:image`
4. **Verify** it shows your Supabase URL:
   ```html
   <meta property="og:image" content="https://swghelvkzagyrwiyvlsd.supabase.co/storage/v1/object/public/property_images/...">
   ```

If the meta tag is correct, the issue is definitely caching.

### 3. **Image Requirements**

Some platforms have strict requirements:

- **Minimum size:** 200x200px
- **Recommended:** 1200x630px (1.91:1 ratio)
- **Max file size:** 8MB
- **Formats:** JPG, PNG, WebP

Your images should meet these. If they don't, platforms might reject them.

### 4. **CORS Headers**

Since your image works in the browser, CORS is fine. But verify Supabase storage bucket has proper CORS settings for social media crawlers.

## 🧪 Testing Steps

1. **Test Image URL Directly:**
   - ✅ Already works: `https://swghelvkzagyrwiyvlsd.supabase.co/storage/v1/object/public/property_images/...`

2. **Check Meta Tags:**
   ```bash
   # In browser console on property page:
   document.querySelector('meta[property="og:image"]').content
   # Should return your Supabase URL
   ```

3. **Test with Facebook Debugger:**
   - Enter property URL
   - Click "Scrape Again"
   - Check if image appears in preview

4. **Test Share on WhatsApp:**
   - Share property link
   - Check if image preview appears
   - If not, use Facebook debugger first (WhatsApp uses Facebook's system)

## 🚀 Quick Fix

**Most likely solution:** Clear social media cache using debuggers above.

**If that doesn't work:**
1. Verify image dimensions meet platform requirements
2. Check if image file size is reasonable (< 1MB recommended)
3. Wait 24-48 hours (some platforms cache for days)

## 📝 Code Verification

Your code is correct:
- ✅ Supabase URLs are used directly (no modification)
- ✅ Meta tags are set dynamically
- ✅ Domain is updated to `gmblux.com`
- ✅ Fallback to logo if no property image

The issue is **not your code** - it's social media caching!

