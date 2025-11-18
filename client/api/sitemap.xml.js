/**
 * Dynamic Sitemap Generator for Vercel Serverless Functions
 * Fetches all properties from Supabase and generates sitemap.xml
 * 
 * Deploy this as a Vercel serverless function:
 * - File: api/sitemap.xml.js
 * - Accessible at: https://gmblux.com/api/sitemap.xml
 */

const SUPABASE_URL = 'https://swghelvkzagyrwiyvlsd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Z2hlbHZremFneXJ3aXl2bHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTY2MjIsImV4cCI6MjA3NTA3MjYyMn0.RAjfwOGR12wXgEQdzMON6KfAz2AIwqKcIWy5wb9696I';
const BASE_URL = 'https://gmblux.com';

export default async function handler(req, res) {
  try {
    // Fetch all published properties from Supabase
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=id,updated_at&order=updated_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    const properties = await response.json();

    // Get current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
${properties
  .map((property) => {
    const propertyLastMod = property.updated_at
      ? new Date(property.updated_at).toISOString().split('T')[0]
      : currentDate;
    
    return `  <url>
    <loc>${BASE_URL}/listing/${property.id}</loc>
    <lastmod>${propertyLastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    // Set headers for XML response
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Fallback sitemap with just static pages
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/listings</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(fallbackSitemap);
  }
}

