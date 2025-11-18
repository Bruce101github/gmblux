/**
 * Dynamic Sitemap Generator for Vercel Serverless Functions
 * Fetches all properties from Supabase and generates sitemap.xml
 * 
 * Accessible at: https://gmblux.com/sitemap.xml (via vercel.json rewrite)
 */

const SUPABASE_URL = 'https://swghelvkzagyrwiyvlsd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Z2hlbHZremFneXJ3aXl2bHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTY2MjIsImV4cCI6MjA3NTA3MjYyMn0.RAjfwOGR12wXgEQdzMON6KfAz2AIwqKcIWy5wb9696I';
const BASE_URL = 'https://gmblux.com';

export default async function handler(req, res) {
  try {
    // Fetch all properties from Supabase (no filters to get all)
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=id,created_at&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
      }
    );

    let properties = [];
    
    if (response.ok) {
      const data = await response.json();
      // Ensure we have an array
      properties = Array.isArray(data) ? data : [];
    } else {
      console.error('Supabase API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }

    // Get current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0];

    // Generate sitemap XML
    const propertyUrls = properties.length > 0
      ? properties
          .map((property) => {
            const propertyLastMod = property.created_at
              ? new Date(property.created_at).toISOString().split('T')[0]
              : currentDate;
            
            return `  <url>
    <loc>${BASE_URL}/listing/${property.id}</loc>
    <lastmod>${propertyLastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
          })
          .join('\n')
      : '';

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Listings Page -->
  <url>
    <loc>${BASE_URL}/listings</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Property Pages -->
${propertyUrls}
</urlset>`;

    // Set headers for XML response
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    console.error('Error stack:', error.stack);
    
    // Fallback sitemap with just static pages
    const currentDate = new Date().toISOString().split('T')[0];
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/listings</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(fallbackSitemap);
  }
}

