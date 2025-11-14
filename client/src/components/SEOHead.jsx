import { useEffect } from "react";

/**
 * Dynamic SEO component for updating meta tags per page
 * Usage: <SEOHead title="..." description="..." image="..." />
 */
export default function SEOHead({
  title = "GMB Luxury Properties - Premium Real Estate in Ghana",
  description = "Find luxury homes, apartments, and properties for sale and rent in Ghana. Browse premium real estate listings in Accra, Kumasi, and across Ghana.",
  image = "https://gmblux.vercel.app/gmblogo.JPG",
  url = typeof window !== "undefined" ? window.location.href : "https://gmblux.vercel.app",
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

    // Open Graph tags
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", image);
    updateMetaTag("og:url", url);
    updateMetaTag("og:type", type);

    // Twitter Card tags
    updateNameMetaTag("twitter:card", "summary_large_image");
    updateNameMetaTag("twitter:title", title);
    updateNameMetaTag("twitter:description", description);
    updateNameMetaTag("twitter:image", image);

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

