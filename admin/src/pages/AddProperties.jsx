import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import DropArea, { DropButton } from "@/components/DropArea";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

function AddProperties() {
  const [files, setFiles] = useState([]);
  const [focus, setFocus] = useState(0);
  const [loading, setLoading] = useState(false);
  const formPreset = {
    title: "",
    description: "",
    currency: "ghs",
    price: "",
    location: "",
    property_type: "house",
    listing_type: "rent",
    bedrooms: "",
    bathrooms: "",
  };

  const [formData, setFormData] = useState({ ...formPreset });

  useEffect(() => {
    console.log("Updated files:", files);
    console.log(files[0]);
  }, [files]);

  function handleState(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(name, value);
  }

  async function insertProperty() {
    setLoading(true);
    try {
      // Show a loading toast while the property is being added
      toast.loading("addding property...", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
      // Push Images to supabase storage bucket
      const imageUrls = [];
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("property_images")
          .upload(fileName, file, {
            contentType: file.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          setLoading(false);
          console.error("Upload error:", error.message);
        }

        // 2️⃣Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from("property_images")
          .getPublicUrl(fileName);

        imageUrls.push(publicUrlData.publicUrl);
      }

      // Insert Property Data with Image Urls
      console.log(formData);
      const { data, error } = await supabase
        .from("properties")
        .insert({ ...formData, images: imageUrls });

      if (error) {
        setLoading(false);
        throw error;
      }
      setTimeout(() => {
        setLoading(false);
        toast.dismiss(); // remove the loading one
        toast.success("Property added successfully!", {
          style: {
            borderRadius: "10px",
            background: "#121420",
            color: "#fff",
            border: "0.4px solid gray",
          },
        });
        setFormData({ ...formPreset });
        setFiles([]);
        // show success
      }, 1000);
    } catch (err) {
      setLoading(false);
      console.error("Error adding property:", err);
      toast.dismiss(); // remove the loading one
      toast.error("Failed to add property!", {
        style: {
          borderRadius: "10px",
          background: "#121420",
          color: "#fff",
          border: "0.4px solid gray",
        },
      });
    }
  }

  const deleteImg = (index) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      setFocus((prevFocus) => {
        // If no files left, clear focus
        if (newFiles.length === 0) return 0;
        // If prevFocus is beyond last index, move focus back
        if (prevFocus >= newFiles.length) return newFiles.length - 1;
        // Otherwise keep same focus
        return prevFocus;
      });
      return newFiles;
    });
  };
  const handlePreview = (index) => {
    const deleteButton = document.getElementById(`${index}`);
    setFocus(index);
    if (window.innerWidth <= 640) {
      files.map((file, i) => {
        const fileDel = document.getElementById(`${i}`);
        fileDel.classList.add("hidden");
      });
      deleteButton.classList.toggle("hidden");
      setTimeout(() => {
        deleteButton.classList.add("hidden");
      }, 1500);
    }
  };

  return (
    <>
      <div className="flex justify-between px-[5%] md:px-0 lg:px-0 mt-[-48px] lg:mt-4">
        {" "}
        <h2 className="text-white text-lg font-medium lg:text-xl lg:font-bold">
          Add New Property
        </h2>
        <div className="hidden lg:flex lg:gap-6 gap-2">
          <Link
            to="/properties"
            className="border border-gray-400 px-4 py-2 rounded-sm text-gray-500"
          >
            Discard
          </Link>
          <button
            className="flex gap-2 bg-yellow-400 px-4 py-2 rounded-sm text-white font-bold"
            form="propertyForm"
            onClick={insertProperty}
          >
            {loading ? (
              <Spinner className="w-[18px] h-[18px] " />
            ) : (
              <Upload size={18} />
            )}{" "}
            <span>Publish</span>
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 lg:gap-5 px-[5%]  lg:px-0 lg:py-0">
        <Card className="p-4 bg-white/10 my-5">
          {files.length > 0 ? (
            <div className="w-full max-h-[40vh] lg:min-h-[400px] rounded-lg">
              <img
                src={files[focus]?.preview}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          ) : (
            <DropArea setFiles={setFiles} />
          )}
          <div className="grid grid-cols-3 gap-2 lg:gap-4">
            {files.map((file, index) => (
              <Card className="max-h-[100px]  lg:max-h-[200px] p-0 relative group">
                <button
                  id={index}
                  className="hidden bg-red-400 p-1 rounded-full group-hover:block absolute right-0 mt-[-10px] mr-[-10px]"
                  onClick={() => {
                    deleteImg(index);
                  }}
                >
                  <X color="white" size={24} />
                </button>
                <img
                  src={file.preview}
                  className="h-full object-cover rounded-lg"
                  onClick={() => {
                    handlePreview(index);
                  }}
                />
              </Card>
            ))}
            {files.length > 0 ? <DropButton setFiles={setFiles} /> : null}
          </div>
        </Card>
        <Card className="px-4 lg:p-8 bg-white/10 mb-5 lg:mt-5">
          <form
            id="propertyForm"
            className="flex flex-col gap-y-5 bg-none"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-col">
              <label htmlFor="title" className="text-white/60 mb-1 text-sm">
                Property Name
              </label>
              <input
                id="title"
                name="title"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                value={formData.title}
                onChange={handleState}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="text-white/60 mb-1 text-sm"
              >
                Description
              </label>
              <textarea
                rows="5"
                cos="40"
                name="description"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                value={formData.description}
                onChange={handleState}
              />
            </div>
            <div className="flex grid grid-cols-2 lg:gap-x-4 gap-x-2">
              <div className="flex flex-col">
                <label
                  htmlFor="currency"
                  className="text-white/60 mb-1 text-sm"
                >
                  Currency
                </label>
                <select
                  name="currency"
                  className="w-full border-white/10 border p-4.5 rounded-sm text-white"
                  value={formData.currency}
                  onChange={handleState}
                >
                  <option value="ghs">GHS ₵</option>
                  <option value="usd">USD $</option>
                </select>
              </div>
              <div className="flex flex-col">
                {" "}
                <label htmlFor="price" className="text-white/60 mb-1 text-sm">
                  Price
                </label>
                <input
                  className="p-4 w-full border border-white/10 rounded-sm text-white"
                  type="number"
                  min="1"
                  name="price"
                  value={formData.price}
                  onChange={handleState}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="location" className="text-white/60 mb-1 text-sm">
                Location
              </label>
              <input
                name="location"
                className="p-2 border-white/10 border-1 rounded-sm text-white"
                value={formData.location}
                onChange={handleState}
              />
            </div>
            <div className="flex grid grid-cols-2 lg:gap-x-4 gap-x-2">
              <div className="flex flex-col">
                <label
                  htmlFor="propertyType"
                  className="text-white/60 mb-1 text-sm"
                >
                  Property Type
                </label>
                <select
                  name="property_type"
                  className="w-full border-white/10 border p-4 rounded-sm text-white"
                  value={formData.property_type}
                  onChange={handleState}
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="duples">Duplex</option>
                  <option value="studio">Studio</option>
                  <option value="land">Lands</option>
                  <option value="commercialProperty">
                    Commercial property
                  </option>
                  <option value="officeSpace">Office space</option>
                  <option value="shop">Shop</option>
                </select>
              </div>
              <div className="flex flex-col">
                {" "}
                <label
                  htmlFor="listingType"
                  className="text-white/60 mb-1 text-sm"
                >
                  Listing Type
                </label>
                <select
                  name="listing_type"
                  className="w-full border-white/10 border p-4 rounded-sm text-white"
                  value={formData.listing_type}
                  onChange={handleState}
                >
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
            </div>
            <div className="flex grid grid-cols-2 lg:gap-x-4 gap-x-2">
              <div className="flex flex-col">
                <label
                  htmlFor="bedrooms"
                  className="text-white/60 mb-1 text-sm"
                >
                  Bedrooms
                </label>
                <input
                  name="bedrooms"
                  className="p-4 w-full border border-white/10 rounded-sm text-white"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.bedrooms}
                  onChange={handleState}
                />
              </div>
              <div className="flex flex-col">
                {" "}
                <label
                  htmlFor="bathrooms"
                  className="text-white/60 mb-1 text-sm"
                >
                  Bathrooms
                </label>
                <input
                  name="bathrooms"
                  className="p-4 w-full border border-white/10 rounded-sm text-white"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.bathrooms}
                  onChange={handleState}
                />
              </div>
            </div>
          </form>
        </Card>
        <div className="lg:hidden md:hidden flex gap-2 grid grid-cols-2 w-full mb-10">
          <button className="border border-gray-400 px-4 py-2 rounded-sm text-gray-500">
            Discard
          </button>
          <button
            className="flex justify-center items-center gap-2 bg-yellow-400 px-4 py-2 rounded-sm text-white font-bold"
            form="propertyForm"
            onClick={insertProperty}
          >
            {loading ? (
              <Spinner className="w-[18px] h-[18px] " />
            ) : (
              <Upload size={18} />
            )}{" "}
            <span>Publish</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AddProperties;
