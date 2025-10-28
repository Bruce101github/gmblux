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

  const [bookingOpen, setBookingOpen] = useState(false);

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
    <div className="text-white px-0 lg:px-[10%] pb-10">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {property.images.map((p) => (
            <CarouselItem>
              {" "}
              <img
                src={p}
                alt={property.title}
                className=" mb-2 w-full h-[60vh] object-cover"
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
  );
}

function WhatsAppButton({ property }) {
  const number = "233553944428";
  const message = `Hi, I am interested in this property and would like to talk some more.
  
Here’s the link: https://gmblux.com/listing/${property.id}`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a href={url} className="p-2 rounded-full bg-white/10">
      <img src={Whatsapp} className="h-[25px] w-[25px]" />
    </a>
  );
}

export default Property;
