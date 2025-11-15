import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { supabase } from "../supabaseClient";
import "../index.css";
import Whatsapp from "@/assets/whatsapp.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import {
  Bed,
  ShowerHead,
  LandPlot,
  VectorSquare,
  MapPin,
  Phone,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { sentenceCase } from "@/utils/changeCase";
import SEOHead from "@/components/SEOHead";
import StructuredData, {
  generatePropertySchema,
  generateBreadcrumbSchema,
} from "@/components/StructuredData";

function Property() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    // Set initial values
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    // Update when user scrolls
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  // Generate SEO meta tags and structured data
  const seoTitle = property
    ? `${property.bedrooms} Bedroom ${property.property_type} for ${property.listing_type} in ${property.location}, Ghana | GMB Luxury Properties`
    : "Property Details | GMB Luxury Properties";

  const seoDescription = property
    ? `${property.bedrooms} bedroom ${property.property_type} for ${property.listing_type} in ${property.location}, Ghana. ${property.currency === "ghs" ? "GH₵" : "USD$"}${Number(property.price).toLocaleString("en-GH")}${property.listing_type === "rent" ? "/month" : ""}. ${property.description?.substring(0, 100) || ""}`
    : "Browse premium real estate listings in Ghana";

  // Get property image - Supabase storage URLs are already absolute
  const getPropertyImage = () => {
    if (!property?.images?.[0]) {
      // Fallback to logo on our domain
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://gmblux.com";
      return `${baseUrl}/gmblogo.JPG`;
    }
    
    const imageUrl = property.images[0];
    
    // Supabase storage URLs are already absolute (https://[project].supabase.co/...)
    // They're stored as public URLs from getPublicUrl(), so use them directly
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl; // Already absolute - Supabase CDN URL
    }
    
    // If somehow relative (shouldn't happen), make it absolute
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://gmblux.com";
    return `${baseUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
  };

  // Get base URL for structured data
  const getBaseUrl = () => {
    return typeof window !== "undefined" ? window.location.origin : "https://gmblux.com";
  };

  const structuredData = property
    ? [
        generatePropertySchema(property, getBaseUrl()),
        generateBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Listings", url: "/listings" },
          { name: property.title || "Property Details", url: `/listing/${property.id}` },
        ], getBaseUrl()),
      ]
    : null;

  // Only render SEOHead when property is loaded to ensure correct image is used
  // This prevents social media crawlers from caching the logo fallback during loading
  const shouldRenderSEO = !loading && property;
  const propertyImage = shouldRenderSEO ? getPropertyImage() : "";
  const propertyUrl = typeof window !== "undefined" ? window.location.href : `https://gmblux.com/listing/${id}`;

  if (loading)
    return (
      <div className="">
        <Skeleton className="h-[60vh] w-full mb-2 rounded-none" />
        <div className="px-[5%] py-[20px]">
          <Skeleton className="h-[14px] w-[100px] mb-2" />
          <Skeleton className="h-[32px] w-[250px] rounded-3xl mb-2" />
          <Skeleton className="h-[14px] w-[200px] mb-2" />
          <Skeleton className="h-[18px] w-[150px] mb-2" />
        </div>
      </div>
    );
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!property)
    return <p className="text-gray-400 text-center">Property not found.</p>;

  return (
    <>
      {shouldRenderSEO && (
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          image={propertyImage}
          url={propertyUrl}
          keywords={`${property.property_type} ${property.listing_type} ${property.location} Ghana, real estate Ghana, property for sale Ghana, houses for rent Ghana`}
        />
      )}
      {structuredData && (
        <StructuredData data={structuredData} />
      )}
      <div className="text-white px-0 lg:px-[10%] pb-10">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {property.images.map((p, index) => (
            <CarouselItem key={index}>
              <img
                src={p}
                alt={`${property.title} - Image ${index + 1} - ${property.location}, Ghana`}
                className=" mb-2 w-full h-[60vh] object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* pagination dots!!! Work on this later */}
        <div className="absolute bottom-5 right-5 bg-black/15 backdrop-blur-sm px-2 py-1 rounded-3xl text-xs">
          {current} / {count}
        </div>
      </Carousel>
      <div className="px-[5%] py-[20px] flex flex-col gap-2">
        <p className="text-md text-blue-400 font-medium">
          {property.bedrooms} Bedroom {""}
          {property.property_type} for {property.listing_type}
        </p>
        <div className="flex justify-between">
          {" "}
          <h1 className="text-3xl lg:text-5xl font-bold">
            {property.currency == "ghs" ? "GH₵" : "USD$"}
            {Number(property.price).toLocaleString("en-GH")}
            {property.listing_type == "rent" ? (
              <span className="text-xl font-medium"> /month</span>
            ) : null}
          </h1>
          <div className="flex gap-2">
            <a
              className="p-2 rounded-full bg-white/10"
              href="tel:+233553944428"
            >
              {" "}
              <Phone />
            </a>
            <WhatsAppButton property={property} />
          </div>
        </div>
        <div className="flex text-white/60 items-center gap-1">
          <MapPin size={16} />
          <p className="text-md font-medium">{property.location}</p>
        </div>
        <div className="flex gap-2 items-center  text-white/60 mt-2">
          {" "}
          <div className="flex gap-2 items-center border border-white/50 py-1 px-4 rounded-3xl">
            {/*<Bed size={16} />*/}
            <p className="text-sm">
              <span className="text-white">{property.bedrooms}</span> Beds
            </p>
          </div>
          <div className="flex gap-2 items-center border border-white/50 py-1 px-4 rounded-3xl">
            {/*<ShowerHead size={16} />*/}
            <p className="text-sm">
              <span className="text-white">{property.bathrooms}</span> Bath
            </p>
          </div>
          {!property.size ? null : (
            <div className="flex gap-2 items-center border border-white/50 py-1 px-4 rounded-3xl">
              {/*<VectorSquare size={16} />*/}
              <p className="text-sm">
                <span className="text-white">{property.size}</span> sqft
              </p>
            </div>
          )}
        </div>
        <div className="border-b border-white/10 my-5 pb-5 flex flex-col gap-1">
          <p className="font-medium text-lg">Property description</p>
          <p className="text-base text-white/60">{property.description}</p>
        </div>
        <div className="flex grid-cols-2 gap-2">
          {property.listing_type == "sale" ? (
            <Link
              to="/booking"
              state={{ preset: "buy", propertyId: property.id }}
              className="w-full py-2 border border-white/40 rounded-3xl"
            >
              <p className="text-center">Buy</p>
            </Link>
          ) : (
            <Link
              to="/booking"
              state={{ preset: "rent", propertyId: property.id }}
              className="w-full py-2 border border-white/40 rounded-3xl"
            >
              <p className="text-center">Rent</p>
            </Link>
          )}

          <Link
            to="/booking"
            state={{ preset: "tour", propertyId: property.id }}
            className="w-full py-2 bg-yellow-400 rounded-3xl font-medium"
          >
            <p className="text-center font-bold">Request a tour</p>
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}

function WhatsAppButton({ property }) {
  const number = "233553944428";
  const message = `Hi, I am interested in this property and would like to talk some more.
  
Here’s the link: https://gmblux.com/listing/${property.id}`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      className="p-2 rounded-full bg-white/10"
      aria-label="Contact via WhatsApp"
    >
      <img
        src={Whatsapp}
        alt="WhatsApp"
        className="h-[25px] w-[25px]"
      />
    </a>
  );
}

export default Property;
