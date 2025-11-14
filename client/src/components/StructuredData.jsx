import { useEffect } from "react";

/**
 * Adds JSON-LD structured data for SEO
 * Supports RealEstateListing, Organization, and BreadcrumbList schemas
 */
export default function StructuredData({ data }) {
  useEffect(() => {
    // Remove existing structured data scripts
    const existingScripts = document.querySelectorAll('[id^="structured-data"]');
    existingScripts.forEach((script) => script.remove());

    if (!data) return;

    // Handle both single objects and arrays
    const dataArray = Array.isArray(data) ? data : [data];

    dataArray.forEach((item, index) => {
      if (!item) return; // Skip null/undefined items

      const script = document.createElement("script");
      script.id = `structured-data-${index}`;
      script.type = "application/ld+json";
      script.text = JSON.stringify(item);
      document.head.appendChild(script);
    });

    return () => {
      const scriptsToRemove = document.querySelectorAll('[id^="structured-data"]');
      scriptsToRemove.forEach((script) => script.remove());
    };
  }, [data]);

  return null;
}

/**
 * Generate RealEstateListing schema for a property
 */
export function generatePropertySchema(property, baseUrl = "https://gmblux.vercel.app") {
  if (!property) return null;

  const price = property.price || 0;
  const currency = property.currency === "ghs" ? "GHS" : "USD";
  const listingType = property.listing_type === "rent" ? "RentAction" : "SellAction";
  const propertyType = property.property_type || "House";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title || `${property.bedrooms} Bedroom ${propertyType} for ${property.listing_type}`,
    description: property.description || `${property.bedrooms} bedroom ${property.property_type} for ${property.listing_type} in ${property.location}, Ghana`,
    image: property.images?.[0] || `${baseUrl}/gmblogo.JPG`,
    url: `${baseUrl}/listing/${property.id}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location || "Ghana",
      addressCountry: "GH",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Add coordinates if available in property data
    },
    numberOfRooms: property.bedrooms || 0,
    numberOfBathroomsTotal: property.bathrooms || 0,
    floorSize: property.size ? {
      "@type": "QuantitativeValue",
      value: property.size,
      unitCode: "SQM",
    } : undefined,
    price: {
      "@type": "MonetaryAmount",
      currency: currency,
      value: price,
    },
    priceCurrency: currency,
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Product",
      name: property.title,
      category: propertyType,
    },
    potentialAction: {
      "@type": listingType,
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/listing/${property.id}`,
      },
    },
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(baseUrl = "https://gmblux.vercel.app") {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${baseUrl}#organization`,
    name: "GMB Luxury Properties",
    alternateName: "GMB Lux",
    url: baseUrl,
    logo: `${baseUrl}/gmblogo.JPG`,
    description: "Premium real estate agency in Ghana. Find luxury homes, apartments, and properties for sale and rent in Accra, Kumasi, and across Ghana.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GH",
    },
    telephone: "+233553944428",
    sameAs: [
      "https://www.instagram.com/gmb_realestate_ghana/",
      "https://www.tiktok.com/@gmb_realestateghana",
      "https://www.facebook.com/profile.php?id=100071139317552",
    ],
    areaServed: {
      "@type": "Country",
      name: "Ghana",
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items, baseUrl = "https://gmblux.vercel.app") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  };
}

