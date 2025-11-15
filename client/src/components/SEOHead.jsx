import { useEffect } from "react";

/**
 * Dynamic SEO component for updating meta tags per page
 * Usage: <SEOHead title="..." description="..." image="..." />
 */
export default function SEOHead({
  title = "GMB Luxury Properties - Premium Real Estate in Ghana",
  description = "Find luxury homes, apartments, and properties for sale and rent in Ghana. Browse premium real estate listings in Accra, Kumasi, and across Ghana.",
  image = typeof window !== "undefined" ? `${window.location.origin}/gmblogo.JPG` : "https://gmblux.com/gmblogo.JPG",
  url = typeof window !== "undefined" ? window.location.href : "https://gmblux.com",
  type = "website",
  keywords = "real estate Ghana, property for sale Ghana, houses for rent Ghana, luxury apartments Accra, property Ghana",
}) {
  useEffect(() => {
    // Update or create meta tags
    const updateMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateNameMetaTag = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update title
    document.title = title;

    // Update meta description
    updateNameMetaTag("description", description);

    // Update keywords
    updateNameMetaTag("keywords", keywords);

    // Ensure image URL is absolute and properly formatted for social media
    let absoluteImage = image;
    
    if (!image.startsWith("http://") && !image.startsWith("https://")) {
      // Relative URL - make it absolute using current domain
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://gmblux.com";
      absoluteImage = `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;
    }
    
    // Supabase storage URLs are already absolute (https://[project].supabase.co/...)
    // They don't need domain prepending - they're on Supabase's CDN
    // Social media crawlers can access them directly if the bucket is public

    // Open Graph tags (for Facebook, LinkedIn, WhatsApp, etc.)
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", absoluteImage);
    updateMetaTag("og:image:secure_url", absoluteImage); // HTTPS version for secure platforms
    updateMetaTag("og:url", url);
    updateMetaTag("og:type", type);

    // Twitter Card tags
    updateNameMetaTag("twitter:card", "summary_large_image");
    updateNameMetaTag("twitter:title", title);
    updateNameMetaTag("twitter:description", description);
    updateNameMetaTag("twitter:image", absoluteImage);
    updateNameMetaTag("twitter:image:alt", title);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, image, url, type, keywords]);

  return null;
}

