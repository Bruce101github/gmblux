import { Card } from "@/components/ui/card";
import DropArea from "@/components/DropArea";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

function AddProperties() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    currency: "ghs",
    price: "",
    location: "",
    property_type: "house",
    listing_type: "rent",
    bedrooms: "",
    bathrooms: "",
  });

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
    try {
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

      if (error) throw error;
      alert("✅ Property added successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error inserting property:", err);
    }
  }

  return (
    <Card className="w-full min-h-[100vh] bg-white p-8 ">
      <div className="flex justify-between">
        {" "}
        <h2>Add New Property</h2>
        <div className="flex gap-6">
          <button className="border border-gray-400 px-4 py-2 rounded-sm text-gray-500">
            Discard
          </button>
          <button
            className="bg-yellow-400 px-4 py-2 rounded-sm text-white font-bold"
            form="propertyForm"
            onClick={insertProperty}
          >
            Publish
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <Card className="p-4">
          <p>Add images</p>
          <DropArea setFiles={setFiles} />
          <div className="grid grid-cols-3 gap-4">
            {files.map((file) => (
              <Card className="max-h-[200px] p-0">
                <img
                  src={file.preview}
                  className="h-full object-cover rounded-lg"
                />
              </Card>
            ))}
          </div>
        </Card>
        <Card className="p-8">
          <form
            id="propertyForm"
            className="flex flex-col gap-y-5"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <p>Property Details</p>
            <div className="flex flex-col">
              <label htmlFor="title" className="text-gray-600">
                Property Name
              </label>
              <input
                id="title"
                name="title"
                className="border-gray-300 border-1 rounded-sm p-2"
                value={formData.title}
                onChange={handleState}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-gray-600">
                Description
              </label>
              <input
                name="description"
                className="border-gray-300 border-1 rounded-sm p-2"
                value={formData.description}
                onChange={handleState}
              />
            </div>
            <div className="flex grid grid-cols-2 gap-x-4">
              <div className="flex flex-col">
                <label htmlFor="currency" className="text-gray-600">
                  Currency
                </label>
                <select
                  name="currency"
                  className="w-full border-gray-300 border p-4.5 rounded-sm"
                  value={formData.currency}
                  onChange={handleState}
                >
                  <option value="ghs">GHS ₵</option>
                  <option value="usd">USD $</option>
                </select>
              </div>
              <div className="flex flex-col">
                {" "}
                <label htmlFor="price" className="text-gray-600">
                  Price
                </label>
                <input
                  className="p-4 w-full border border-gray-300 rounded-sm"
                  type="number"
                  min="1"
                  name="price"
                  value={formData.price}
                  onChange={handleState}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="location" className="text-gray-600">
                Location
              </label>
              <input
                name="location"
                className="p-2 border-gray-200 border-1 rounded-sm"
                value={formData.location}
                onChange={handleState}
              />
            </div>
            <div className="flex grid grid-cols-2 gap-x-4">
              <div className="flex flex-col">
                <label htmlFor="propertyType" className="text-gray-600">
                  Property Type
                </label>
                <select
                  name="property_type"
                  className="w-full border-gray-300 border p-4 rounded-sm"
                  value={formData.property_type}
                  onChange={handleState}
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="mansion">Mansion</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="duples">Duples</option>
                  <option value="studio">Studio</option>
                  <option value="land">Land/Plot</option>
                  <option value="commercialProperty">
                    Commercial property
                  </option>
                  <option value="officeSpace">Office space</option>
                  <option value="shop">Shop/Store front</option>
                </select>
              </div>
              <div className="flex flex-col">
                {" "}
                <label htmlFor="listingType" className="text-gray-600">
                  Listing Type
                </label>
                <select
                  name="listing_type"
                  className="w-full border-gray-300 border p-4 rounded-sm"
                  value={formData.listing_type}
                  onChange={handleState}
                >
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
            </div>
            <div className="flex grid grid-cols-2 gap-x-4">
              <div className="flex flex-col">
                <label htmlFor="bedrooms" className="text-gray-600">
                  Bedrooms
                </label>
                <input
                  name="bedrooms"
                  className="p-4 w-full border border-gray-300 rounded-sm"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.bedrooms}
                  onChange={handleState}
                />
              </div>
              <div className="flex flex-col">
                {" "}
                <label htmlFor="bathrooms" className="text-gray-600">
                  Bathrooms
                </label>
                <input
                  name="bathrooms"
                  className="p-4 w-full border border-gray-300 rounded-sm"
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
      </div>
    </Card>
  );
}

export default AddProperties;
