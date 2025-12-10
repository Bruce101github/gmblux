import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { supabase } from "../supabaseClient";
import "../index.css";
import Whatsapp from "@/assets/whatsapp.png";
import { getMainImageUrl, generateSrcset, generateSizes } from "../utils/imageOptimizer";
import ContactInfoModal from "@/components/ContactInfoModal";
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
  Car,
  Shield,
  Camera,
  Wind,
  Home,
  Waves,
  Wifi,
  Droplet,
  Sofa,
  Zap,
  Sun,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Bus,
  Route,
  Calendar,
  DollarSign,
  Plug,
  Receipt,
  FileText,
  FileCheck,
  CreditCard,
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
  const [loadedImages, setLoadedImages] = React.useState(new Set());
  const [contactModalOpen, setContactModalOpen] = React.useState(false);
  const [contactActionType, setContactActionType] = React.useState(null);

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

  // Preload and track loaded images
  React.useEffect(() => {
    if (!property?.images || !Array.isArray(property.images)) return;

    const currentIndex = current - 1; // Convert to 0-based index
    const imagesToPreload = [];

    // Preload current image and next 2 images
    for (let i = 0; i <= 2; i++) {
      const targetIndex = currentIndex + i;
      if (targetIndex < property.images.length && property.images[targetIndex]) {
        imagesToPreload.push({
          index: targetIndex,
          url: property.images[targetIndex],
        });
      }
    }

    // Preload images and track when they're loaded
    imagesToPreload.forEach(({ index, url }) => {
      if (url && !loadedImages.has(index)) {
        const img = new Image();
        const optimizedUrl = getMainImageUrl(url) || url;
        
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, index]));
        };
        
        img.onerror = () => {
          // Still mark as "loaded" to prevent infinite retries
          setLoadedImages((prev) => new Set([...prev, index]));
        };
        
        img.src = optimizedUrl;
      }
    });
  }, [current, property?.images, loadedImages]);

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
        // Reset loaded images when property changes, pre-mark first image as loaded
        setLoadedImages(new Set([0]));
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
    
    const imageUrl = property.images?.[0];
    
    if (!imageUrl) {
      // Fallback to logo if no image URL
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://gmblux.com";
      return `${baseUrl}/gmblogo.JPG`;
    }
    
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
          {property.images && Array.isArray(property.images) && property.images.length > 0 ? (
            property.images.map((p, index) => {
              const isFirstImage = index === 0;
              const isImageLoaded = loadedImages.has(index) || isFirstImage;
              const optimizedUrl = getMainImageUrl(p) || p;
              
              return (
                <CarouselItem key={index}>
                  {isImageLoaded ? (
                    <img
                      src={optimizedUrl}
                      srcSet={p ? generateSrcset(p, {
                        small: 800,
                        medium: 1200,
                        large: 1600,
                      }, 75) : undefined}
                      sizes={generateSizes({
                        '(max-width: 640px)': '100vw',
                        '(max-width: 1024px)': '100vw',
                        '(min-width: 1025px)': '100vw',
                      })}
                      alt={`${property.title} - Image ${index + 1} - ${property.location}, Ghana`}
                      className="mb-2 w-full h-[60vh] object-cover"
                      loading={isFirstImage ? "eager" : "lazy"}
                      fetchPriority={isFirstImage ? "high" : "auto"}
                      decoding="async"
                      width={1200}
                      height={675}
                      style={{ aspectRatio: "16/9" }}
                    />
                  ) : (
                    <div className="mb-2 w-full h-[60vh] bg-gray-800/50 flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
                      <div className="text-white/50 text-sm">Loading image...</div>
                    </div>
                  )}
                </CarouselItem>
              );
            })
          ) : (
            <CarouselItem>
              <img
                src={getPropertyImage()}
                alt={`${property.title} - ${property.location}, Ghana`}
                className=" mb-2 w-full h-[60vh] object-cover"
                loading="eager"
              />
            </CarouselItem>
          )}
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
            <button
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => {
                setContactActionType("call");
                setContactModalOpen(true);
              }}
              aria-label="Call"
            >
              <Phone />
            </button>
            <WhatsAppButton 
              property={property} 
              onOpenModal={() => {
                setContactActionType("whatsapp");
                setContactModalOpen(true);
              }}
            />
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
        {property.features && Array.isArray(property.features) && property.features.length > 0 && (
          <div className="border-b border-white/10 my-5 pb-5 flex flex-col gap-3">
            <p className="font-medium text-lg">Property Features</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {property.features.map((feature) => {
                const featureLabels = {
                  parking: "Parking",
                  garage: "Garage",
                  gated_community: "Gated Community",
                  security_cameras: "Security Cameras",
                  air_conditioning: "Air Conditioning",
                  balcony: "Balcony",
                  swimming_pool: "Swimming Pool",
                  wifi: "WiFi",
                  water_heater: "Water Heater",
                  furnished: "Furnished",
                  generator: "Generator",
                  solar_power: "Solar Power",
                  water_reservoir: "Water Reservoir",
                  kitchen_appliances: "Kitchen Appliances",
                  ceiling_fans: "Ceiling Fans",
                  intercom: "Intercom",
                  cable_tv: "Cable TV",
                  security_guard: "Security Guard",
                  electric_fence: "Electric Fence",
                  barbecue_area: "Barbecue Area",
                  playground: "Playground",
                  gym: "Gym",
                  elevator: "Elevator",
                  fireplace: "Fireplace",
                };
                
                const featureIcons = {
                  parking: Car,
                  garage: Car,
                  gated_community: Shield,
                  security_cameras: Camera,
                  air_conditioning: Wind,
                  balcony: Home,
                  swimming_pool: Waves,
                  wifi: Wifi,
                  water_heater: Droplet,
                  furnished: Sofa,
                  generator: Zap,
                  solar_power: Sun,
                  water_reservoir: Droplet,
                  kitchen_appliances: Home,
                };
                
                const IconComponent = featureIcons[feature] || Home;
                
                return (
                  <div
                    key={feature}
                    className="flex items-center gap-2 border border-white/20 py-2 px-3 rounded-lg"
                  >
                    <IconComponent size={18} className="text-white" />
                    <span className="text-white/80 text-sm">
                      {featureLabels[feature] || sentenceCase(feature)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(property.school_distance || property.hospital_distance || property.market_distance || property.public_transport || property.road_type) && (
          <div className="border-b border-white/10 my-5 pb-5 flex flex-col gap-3">
            <p className="font-medium text-lg">Location & Proximity</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {property.school_distance && (
                <div className="flex items-center gap-3">
                  <GraduationCap size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>School:</strong> {property.school_distance} km away
                  </span>
                </div>
              )}
              {property.hospital_distance && (
                <div className="flex items-center gap-3">
                  <Hospital size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Hospital:</strong> {property.hospital_distance} km away
                  </span>
                </div>
              )}
              {property.market_distance && (
                <div className="flex items-center gap-3">
                  <ShoppingCart size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Market:</strong> {property.market_distance} km away
                  </span>
                </div>
              )}
              {property.public_transport && (
                <div className="flex items-center gap-3">
                  <Bus size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Public Transport:</strong> {sentenceCase(property.public_transport)}
                  </span>
                </div>
              )}
              {property.road_type && (
                <div className="flex items-center gap-3">
                  <Route size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Road Type:</strong> {sentenceCase(property.road_type.replace(/_/g, ' '))}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {property.listing_type === "rent" && 
         (property.min_rent_duration || property.deposit_amount || property.utilities_included || property.billing_type) && (
          <div className="border-b border-white/10 my-5 pb-5 flex flex-col gap-3">
            <p className="font-medium text-lg">Rental Details</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {property.min_rent_duration && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Min. Rent Duration:</strong> {sentenceCase(property.min_rent_duration.replace(/_/g, ' '))}
                  </span>
                </div>
              )}
              {property.deposit_amount && (
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Deposit:</strong> {property.currency === "ghs" ? "GH₵" : "USD$"}{Number(property.deposit_amount).toLocaleString("en-GH")}
                  </span>
                </div>
              )}
              {property.utilities_included && (
                <div className="flex items-center gap-3">
                  <Plug size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Utilities:</strong> {sentenceCase(property.utilities_included.replace(/_/g, ' '))}
                  </span>
                </div>
              )}
              {property.billing_type && (
                <div className="flex items-center gap-3">
                  <Receipt size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Billing Type:</strong> {sentenceCase(property.billing_type.replace(/_/g, ' '))}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {property.listing_type === "sale" && 
         (property.land_title_type || property.ownership_document || property.payment_plan_available) && (
          <div className="border-b border-white/10 my-5 pb-5 flex flex-col gap-3">
            <p className="font-medium text-lg">Sale Details</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {property.land_title_type && (
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Title Type:</strong> {sentenceCase(property.land_title_type.replace(/_/g, ' '))}
                  </span>
                </div>
              )}
              {property.ownership_document && (
                <div className="flex items-center gap-3">
                  <FileCheck size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Ownership Document:</strong> {sentenceCase(property.ownership_document.replace(/_/g, ' '))}
                  </span>
                </div>
              )}
              {property.payment_plan_available && (
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-white" />
                  <span className="text-white/80 text-sm">
                    <strong>Payment Plan:</strong> {sentenceCase(property.payment_plan_available.replace(/_/g, ' '))}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
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
      <ContactInfoModal
        isOpen={contactModalOpen}
        onClose={() => {
          setContactModalOpen(false);
          setContactActionType(null);
        }}
        onContinue={async (contactInfo) => {
          // Save contact info to Supabase
          try {
            // Ensure property_id is properly formatted (convert to string if it's a number)
            const propertyId = property?.id ? String(property.id) : null;
            
            const { error } = await supabase
              .from("contact_inquiries")
              .insert({
                name: contactInfo.name?.trim() || null,
                phone: contactInfo.phone?.trim() || null,
                email: contactInfo.email?.trim() || null,
                property_id: propertyId,
                contact_method: contactActionType,
              });

            if (error) {
              console.error("Error saving contact info:", error);
              // Continue with the action even if save fails
            }
          } catch (err) {
            console.error("Error saving contact info:", err);
            // Continue with the action even if save fails
          }

          // Handle the contact action after user provides info
          if (contactActionType === "call") {
            // Proceed with phone call
            window.location.href = "tel:+233553944428";
          } else if (contactActionType === "whatsapp") {
            // Proceed with WhatsApp
            const number = "233553944428";
            const message = `Hi, I am interested in this property and would like to talk some more.
  
Here's the link: https://gmblux.com/listing/${property.id}`;
            const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
          }
        }}
        actionType={contactActionType}
      />
      </div>
    </>
  );
}

function WhatsAppButton({ property, onOpenModal }) {
  return (
    <button
      onClick={onOpenModal}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      aria-label="Contact via WhatsApp"
    >
      <img
        src={Whatsapp}
        alt="WhatsApp"
        className="h-[25px] w-[25px]"
      />
    </button>
  );
}

export default Property;
