# Social Media Image Sharing Fix

## Issue: Images Not Showing on Social Media

Even though Supabase storage is public, images might not show on social media platforms. Here's why and how to fix it:

### Common Causes:

1. **Social Media Caching**
   - Platforms cache images aggressively
   - They might have cached your old logo
   - **Solution:** Use platform debuggers to clear cache

2. **Image URL Format**
   - Supabase storage URLs should be absolute (https://)
   - Must be publicly accessible (no auth required)
   - **Solution:** Verify URLs are in format: `https://[project].supabase.co/storage/v1/object/public/[bucket]/[file]`

3. **Image Requirements**
   - Minimum size: 200x200px (recommended: 1200x630px)
   - Max file size: 8MB
   - Supported formats: JPG, PNG, WebP
   - **Solution:** Ensure images meet these requirements

4. **CORS Headers**
   - Social media crawlers need proper CORS headers
   - Supabase public buckets should have this by default
   - **Solution:** Verify bucket is set to public

### How to Test:

1. **Facebook Debugger:**
   - https://developers.facebook.com/tools/debug/
   - Enter your property URL
   - Click "Scrape Again" to clear cache
   - Check if image appears

2. **Twitter Card Validator:**
   - https://cards-dev.twitter.com/validator
   - Enter your property URL
   - Check preview

3. **LinkedIn Post Inspector:**
   - https://www.linkedin.com/post-inspector/
   - Enter your property URL

### Verification Steps:

1. Check if image URL is accessible:
   - Open image URL directly in browser (should load)
   - Check browser console for CORS errors
   - Verify URL starts with `https://`

2. Check Supabase Storage Settings:
   - Bucket must be **public**
   - Files must have public read access
   - No RLS policies blocking public access

3. Check Meta Tags:
   - View page source
   - Look for `<meta property="og:image" content="...">`
   - Verify URL matches your property image

### If Images Still Don't Show:

1. **Use a CDN or Image Proxy:**
   - Some platforms prefer CDN URLs
   - Consider using Cloudinary or Imgix

2. **Verify Image Dimensions:**
   - Ensure images are at least 1200x630px
   - Use proper aspect ratio (1.91:1 for og:image)

3. **Check Image Format:**
   - Convert to JPG if using PNG
   - Ensure file size is reasonable (< 1MB recommended)

4. **Wait for Cache to Clear:**
   - Social platforms cache aggressively
   - May take 24-48 hours for changes to appear
   - Use debugger tools to force refresh

