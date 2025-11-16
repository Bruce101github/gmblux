import { Link, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import DropArea, { DropButton } from "@/components/DropArea";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { TOAST_STYLE } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { resizeImage, isImageFile } from "@/lib/imageUtils";

function AddProperties() {
  const [searchParams] = useSearchParams();
  const editPropertyId = searchParams.get("edit");
  const isEditMode = !!editPropertyId;

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Store existing image URLs
  const [focus, setFocus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(false);
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
    school_distance: "",
    hospital_distance: "",
    market_distance: "",
    public_transport: "",
    road_type: "",
    // Rent-specific fields
    min_rent_duration: "",
    deposit_amount: "",
    utilities_included: "",
    billing_type: "",
    // Sale-specific fields
    land_title_type: "",
    ownership_document: "",
    payment_plan_available: "",
    // Owner information
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    owner_whatsapp: "",
    owner_type: "landlord",
    owner_address: "",
    owner_notes: "",
  };

  const [formData, setFormData] = useState({ ...formPreset });
  const [features, setFeatures] = useState([]);
  const [preferredContact, setPreferredContact] = useState("phone"); // phone, email, whatsapp

  // Reset form when component mounts (for fresh start when navigating back)
  useEffect(() => {
    if (!isEditMode) {
      // Reset form to initial state when not in edit mode
      setFormData({ ...formPreset });
      setFiles([]);
      setFeatures([]);
      setExistingImages([]);
      setPreferredContact("phone");
      setFocus(0);
    }
  }, []); // Only run on mount

  // Fetch property data when in edit mode
  useEffect(() => {
    if (isEditMode && editPropertyId) {
      fetchPropertyData(editPropertyId);
    }
  }, [isEditMode, editPropertyId]);

  async function fetchPropertyData(propertyId) {
    setLoadingProperty(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) {
        toast.error(`Failed to load property: ${error.message}`, {
          style: TOAST_STYLE,
        });
        return;
      }

      if (data) {
        // Prefill form data
        setFormData({
          title: data.title || "",
          description: data.description || "",
          currency: data.currency || "ghs",
          price: data.price?.toString() || "",
          location: data.location || "",
          property_type: data.property_type || "house",
          listing_type: data.listing_type || "rent",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          school_distance: data.school_distance?.toString() || "",
          hospital_distance: data.hospital_distance?.toString() || "",
          market_distance: data.market_distance?.toString() || "",
          public_transport: data.public_transport || "",
          road_type: data.road_type || "",
          min_rent_duration: data.min_rent_duration || "",
          deposit_amount: data.deposit_amount?.toString() || "",
          utilities_included: data.utilities_included || "",
          billing_type: data.billing_type || "",
          land_title_type: data.land_title_type || "",
          ownership_document: data.ownership_document || "",
          payment_plan_available: data.payment_plan_available || "",
          owner_name: data.owner_name || "",
          owner_phone: data.owner_phone || "",
          owner_email: data.owner_email || "",
          owner_whatsapp: data.owner_whatsapp || "",
          owner_type: data.owner_type || "landlord",
          owner_address: data.owner_address || "",
          owner_notes: data.owner_notes || "",
        });

        // Set preferred contact
        if (data.owner_preferred_contact) {
          setPreferredContact(data.owner_preferred_contact);
        } else {
          setPreferredContact("phone"); // Default
        }

        // Set features
        if (data.features && Array.isArray(data.features)) {
          setFeatures(data.features);
        }

        // Handle existing images - convert URLs to preview objects
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          setExistingImages(data.images);
          // Create preview objects for existing images
          const imagePreviews = data.images.map((url) => ({
            preview: url,
            isExisting: true, // Flag to identify existing images
            url: url,
          }));
          setFiles(imagePreviews);
        }
      }
    } catch (err) {
      toast.error("Failed to load property data", {
        style: TOAST_STYLE,
      });
    } finally {
      setLoadingProperty(false);
    }
  }

  function handleState(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateProperty() {
    const errors = [];

    // Required basic fields
    if (!formData.title || formData.title.trim() === "") {
      errors.push("Property Name is required");
    }
    if (!formData.description || formData.description.trim() === "") {
      errors.push("Description is required");
    }
    if (!formData.price || formData.price === "") {
      errors.push("Price is required");
    }
    if (!formData.location || formData.location.trim() === "") {
      errors.push("Location is required");
    }
    if (!formData.bedrooms || formData.bedrooms === "") {
      errors.push("Number of bedrooms is required");
    }
    if (!formData.bathrooms || formData.bathrooms === "") {
      errors.push("Number of bathrooms is required");
    }

    // At least 1 image required (either existing or new)
    if (files.length === 0 && existingImages.length === 0) {
      errors.push("At least one image is required");
    }

    // Rent-specific required fields
    if (formData.listing_type === "rent") {
      if (!formData.min_rent_duration || formData.min_rent_duration === "") {
        errors.push("Minimum rent duration is required for rental properties");
      }
      if (!formData.deposit_amount || formData.deposit_amount === "") {
        errors.push("Deposit amount is required for rental properties");
      }
    }

    // Sale-specific required fields
    if (formData.listing_type === "sale") {
      if (!formData.land_title_type || formData.land_title_type === "") {
        errors.push("Land title type is required for sale properties");
      }
      if (!formData.ownership_document || formData.ownership_document === "") {
        errors.push("Ownership document type is required for sale properties");
      }
    }

    return errors;
  }

  async function insertProperty() {
    // Validate before proceeding
    const validationErrors = validateProperty();
    if (validationErrors.length > 0) {
      // Show first error, or all errors if multiple
      if (validationErrors.length === 1) {
        toast.error(validationErrors[0], {
          style: TOAST_STYLE,
        });
      } else {
        toast.error(`${validationErrors.length} errors found. ${validationErrors[0]}`, {
          style: TOAST_STYLE,
          duration: 4000,
        });
        // Show remaining errors after a delay
        validationErrors.slice(1).forEach((error, index) => {
          setTimeout(() => {
            toast.error(error, {
              style: TOAST_STYLE,
              duration: 3000,
            });
          }, (index + 1) * 1000);
        });
      }
      return;
    }

    setLoading(true);
    try {
      // Show a loading toast
      toast.loading(isEditMode ? "Updating property..." : "Adding property...", {
        style: TOAST_STYLE,
      });
      
      // Handle images: keep existing URLs and upload new files
      const imageUrls = [...existingImages]; // Start with existing images
      
      // Upload new files (only files that are not existing images)
      const newFiles = files.filter(file => 
        !file.isExisting && 
        typeof file !== "string" && 
        file.name &&
        file instanceof File
      );
      
      for (const file of newFiles) {

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
          toast.dismiss();
          toast.error(`Failed to upload image: ${error.message}`, {
            style: TOAST_STYLE,
          });
          throw new Error(`Failed to upload image: ${error.message}`);
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from("property_images")
          .getPublicUrl(fileName);

        imageUrls.push(publicUrlData.publicUrl);
      }

      // Prepare data for insertion - include all fields from all cards
      const propertyData = {
        // Basic property info (from first card)
        title: formData.title || null,
        description: formData.description || null,
        currency: formData.currency || "ghs",
        price: formData.price ? parseFloat(formData.price) : null,
        location: formData.location || null,
        property_type: formData.property_type || null,
        listing_type: formData.listing_type || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        images: imageUrls,
        features: features.length > 0 ? features : null, // Features array from checkboxes
        
        // Location & Proximity fields (second card)
        school_distance: formData.school_distance ? parseFloat(formData.school_distance) : null,
        hospital_distance: formData.hospital_distance ? parseFloat(formData.hospital_distance) : null,
        market_distance: formData.market_distance ? parseFloat(formData.market_distance) : null,
        public_transport: formData.public_transport || null,
        road_type: formData.road_type || null,
        
        // Rent-specific fields (only include if listing_type is rent)
        ...(formData.listing_type === "rent" && {
          min_rent_duration: formData.min_rent_duration || null,
          deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
          utilities_included: formData.utilities_included || null,
          billing_type: formData.billing_type || null,
          // Clear sale-specific fields when rent is selected
          land_title_type: null,
          ownership_document: null,
          payment_plan_available: null,
        }),
        
        // Sale-specific fields (only include if listing_type is sale)
        ...(formData.listing_type === "sale" && {
          land_title_type: formData.land_title_type || null,
          ownership_document: formData.ownership_document || null,
          payment_plan_available: formData.payment_plan_available || null,
          // Clear rent-specific fields when sale is selected
          min_rent_duration: null,
          deposit_amount: null,
          utilities_included: null,
          billing_type: null,
        }),

        // Owner information fields
        owner_name: formData.owner_name || null,
        owner_phone: formData.owner_phone || null,
        owner_email: formData.owner_email || null,
        owner_whatsapp: formData.owner_whatsapp || null,
        owner_type: formData.owner_type || null,
        owner_address: formData.owner_address || null,
        owner_notes: formData.owner_notes || null,
        owner_preferred_contact: preferredContact || null,
      };

      // Insert or Update Property Data
      let result;
      if (isEditMode) {
        // Update existing property
        result = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", editPropertyId);
      } else {
        // Insert new property
        result = await supabase
          .from("properties")
          .insert(propertyData);
      }

      const { data, error } = result;

      if (error) {
        setLoading(false);
        toast.dismiss();
        toast.error(`Failed to ${isEditMode ? "update" : "save"} property: ${error.message}`, {
          style: TOAST_STYLE,
          duration: 4000,
        });
        throw error;
      }
      setTimeout(() => {
        setLoading(false);
        toast.dismiss(); // remove the loading one
        toast.success(`Property ${isEditMode ? "updated" : "added"} successfully! 🎉`, {
          style: TOAST_STYLE,
          duration: 3000,
        });
        
        // Clear blob URLs before redirecting to prevent memory leaks
        const currentFiles = [...files]; // Copy array before clearing
        currentFiles.forEach((file) => {
          if (file && file.preview && typeof file.preview === 'string' && file.preview.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(file.preview);
            } catch (e) {
              // Ignore errors when revoking URLs
            }
          }
        });
        
        // Redirect to properties page after successful upload/update
        setTimeout(() => {
          window.location.href = "/properties";
        }, 1500);
      }, 1000);
    } catch (err) {
      setLoading(false);
      toast.dismiss(); // remove the loading one
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add property!";
      toast.error(errorMessage, {
        style: TOAST_STYLE,
        duration: 4000,
      });
    }
  }

  const deleteImg = (index) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const deletedFile = newFiles[index];
      
      // If deleting an existing image, also remove it from existingImages
      if (deletedFile?.isExisting || deletedFile?.url) {
        setExistingImages((prevExisting) => 
          prevExisting.filter((url) => url !== deletedFile.url && url !== deletedFile.preview)
        );
      }
      
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
          {loadingProperty ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-5 h-5" />
              Loading property...
            </span>
          ) : isEditMode ? (
            "Edit Property"
          ) : (
            "Add New Property"
          )}
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
            <span>{isEditMode ? "Update" : "Publish"}</span>
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 lg:gap-5 px-[5%]  lg:px-0 lg:py-0">
        <Card className="p-4 bg-white/10 my-5">
          <div className="mb-2">
            <label className="text-white/60 text-sm">
              Property Images <span className="text-red-400">*</span> (At least 1 required)
            </label>
          </div>
          {files.length > 0 ? (
            <div className="w-full max-h-[40vh] lg:min-h-[400px] rounded-lg overflow-hidden">
              <img
                src={files[focus]?.preview}
                className="w-full h-full rounded-lg object-cover"
                alt="Main preview"
              />
            </div>
          ) : (
            <DropArea setFiles={setFiles} />
          )}
          <div className="grid grid-cols-3 gap-2 lg:gap-4">
            {files.map((file, index) => (
              <Card 
                key={index}
                className="h-[100px] lg:h-[200px] w-full p-0 relative group overflow-visible"
              >
                <img
                  src={file.preview}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => {
                    handlePreview(index);
                  }}
                  alt={`Preview ${index + 1}`}
                />
                <button
                  id={index}
                  className="hidden group-hover:block absolute right-0 mt-[-10px] mr-[-10px] bg-red-400 p-1 rounded-full z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImg(index);
                  }}
                  aria-label="Delete image"
                >
                  <X color="white" size={24} />
                </button>
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
                Property Name <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                required
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
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows="5"
                cos="40"
                name="description"
                required
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
                  Price <span className="text-red-400">*</span>
                </label>
                <input
                  className="p-4 w-full border border-white/10 rounded-sm text-white"
                  type="number"
                  min="1"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleState}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="location" className="text-white/60 mb-1 text-sm">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                name="location"
                required
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
                  Bedrooms <span className="text-red-400">*</span>
                </label>
                <input
                  name="bedrooms"
                  required
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
                  Bathrooms <span className="text-red-400">*</span>
                </label>
                <input
                  name="bathrooms"
                  required
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
        <Card className="px-4 lg:p-8 bg-white/10 mb-5">
          <h3 className="text-white text-lg font-medium mb-4">Property Features</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "parking", label: "Parking" },
              { id: "garage", label: "Garage" },
              { id: "gated_community", label: "Gated Community" },
              { id: "security_cameras", label: "Security Cameras" },
              { id: "air_conditioning", label: "Air Conditioning" },
              { id: "balcony", label: "Balcony" },
              { id: "swimming_pool", label: "Swimming Pool" },
              { id: "wifi", label: "WiFi" },
              { id: "water_heater", label: "Water Heater" },
              { id: "furnished", label: "Furnished" },
              { id: "generator", label: "Generator" },
              { id: "solar_power", label: "Solar Power" },
              { id: "water_reservoir", label: "Water Reservoir" },
              { id: "kitchen_appliances", label: "Kitchen Appliances" },
              { id: "ceiling_fans", label: "Ceiling Fans" },
              { id: "intercom", label: "Intercom" },
              { id: "cable_tv", label: "Cable TV" },
              { id: "security_guard", label: "Security Guard" },
              { id: "electric_fence", label: "Electric Fence" },
              { id: "barbecue_area", label: "Barbecue Area" },
              { id: "playground", label: "Playground" },
              { id: "gym", label: "Gym" },
              { id: "elevator", label: "Elevator" },
              { id: "fireplace", label: "Fireplace" },
            ].map((feature) => (
              <div key={feature.id} className="flex items-center gap-2">
                <Checkbox
                  id={feature.id}
                  checked={features.includes(feature.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFeatures([...features, feature.id]);
                    } else {
                      setFeatures(features.filter((f) => f !== feature.id));
                    }
                  }}
                />
                <label
                  htmlFor={feature.id}
                  className="text-white/80 text-sm cursor-pointer"
                >
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </Card>
        <Card className="px-4 lg:p-8 bg-white/10 mb-5">
          <h3 className="text-white text-lg font-medium mb-4">Location & Proximity</h3>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="school_distance" className="text-white/60 mb-1 text-sm">
                Distance to Nearest School (km)
              </label>
              <input
                id="school_distance"
                name="school_distance"
                type="number"
                min="0"
                step="0.1"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                placeholder="e.g., 2.5"
                value={formData.school_distance}
                onChange={handleState}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="hospital_distance" className="text-white/60 mb-1 text-sm">
                Distance to Nearest Hospital (km)
              </label>
              <input
                id="hospital_distance"
                name="hospital_distance"
                type="number"
                min="0"
                step="0.1"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                placeholder="e.g., 5.0"
                value={formData.hospital_distance}
                onChange={handleState}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="market_distance" className="text-white/60 mb-1 text-sm">
                Distance to Nearest Market (km)
              </label>
              <input
                id="market_distance"
                name="market_distance"
                type="number"
                min="0"
                step="0.1"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                placeholder="e.g., 1.0"
                value={formData.market_distance}
                onChange={handleState}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="public_transport" className="text-white/60 mb-1 text-sm">
                Public Transport Access
              </label>
              <select
                id="public_transport"
                name="public_transport"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                value={formData.public_transport}
                onChange={handleState}
              >
                <option value="">Select option</option>
                <option value="excellent">Excellent - Very close to transport</option>
                <option value="good">Good - Walking distance</option>
                <option value="moderate">Moderate - Short drive away</option>
                <option value="limited">Limited - Limited access</option>
                <option value="none">None - No public transport nearby</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="road_type" className="text-white/60 mb-1 text-sm">
                Road Type
              </label>
              <select
                id="road_type"
                name="road_type"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                value={formData.road_type}
                onChange={handleState}
              >
                <option value="">Select option</option>
                <option value="tarred">Tarred Road</option>
                <option value="untarred">Untarred Road</option>
                <option value="partially_tarred">Partially Tarred</option>
                <option value="highway">Highway Access</option>
                <option value="asphalt">Asphalt Road</option>
              </select>
            </div>
          </div>
        </Card>
        <Card className="px-4 lg:p-8 bg-white/10 mb-5">
          <h3 className="text-white text-lg font-medium mb-4">
            {formData.listing_type === "rent" ? "Rental Details" : "Sale Details"}
          </h3>
          {formData.listing_type === "rent" ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="min_rent_duration" className="text-white/60 mb-1 text-sm">
                  Minimum Rent Duration <span className="text-red-400">*</span>
                </label>
                <select
                  id="min_rent_duration"
                  name="min_rent_duration"
                  required
                  className="border-white/10 border-1 rounded-sm p-2 text-white"
                  value={formData.min_rent_duration}
                  onChange={handleState}
                >
                  <option value="">Select duration</option>
                  <option value="1_month">1 Month</option>
                  <option value="3_months">3 Months</option>
                  <option value="6_months">6 Months</option>
                  <option value="12_months">12 Months</option>
                  <option value="24_months">24 Months (2 Years)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="deposit_amount" className="text-white/60 mb-1 text-sm">
                  Deposit Amount <span className="text-red-400">*</span>
                </label>
                <input
                  id="deposit_amount"
                  name="deposit_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="border-white/10 border-1 rounded-sm p-2 text-white"
                  placeholder="e.g., 5000"
                  value={formData.deposit_amount}
                  onChange={handleState}
                />
                <span className="text-white/40 text-xs mt-1">
                  Deposit amount in {formData.currency === "ghs" ? "GH₵" : "USD$"}
                </span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="utilities_included" className="text-white/60 mb-1 text-sm">
                  Utilities Included
                </label>
                <select
                  id="utilities_included"
                  name="utilities_included"
                  className="border-white/10 border-1 rounded-sm p-2 text-white"
                  value={formData.utilities_included}
                  onChange={handleState}
                >
                  <option value="">Select option</option>
                  <option value="all">All Utilities Included</option>
                  <option value="water_electricity">Water & Electricity</option>
                  <option value="water_only">Water Only</option>
                  <option value="electricity_only">Electricity Only</option>
                  <option value="none">None - Tenant Pays All</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="billing_type" className="text-white/60 mb-1 text-sm">
                  Billing Type
                </label>
                <select
                  id="billing_type"
                  name="billing_type"
                  className="border-white/10 border-1 rounded-sm p-2 text-white"
                  value={formData.billing_type}
                  onChange={handleState}
                >
                  <option value="">Select option</option>
                  <option value="prepaid">Prepaid (Metered)</option>
                  <option value="postpaid">Postpaid (Billed Monthly)</option>
                  <option value="fixed">Fixed Amount Included</option>
                  <option value="separate">Separate Bills</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="land_title_type" className="text-white/60 mb-1 text-sm">
                  Land Title Type <span className="text-red-400">*</span>
                </label>
                <select
                  id="land_title_type"
                  name="land_title_type"
                  required
                  className="border-white/10 border-1 rounded-sm p-2 text-white"
                  value={formData.land_title_type}
                  onChange={handleState}
                >
                  <option value="">Select title type</option>
                  <option value="freehold">Freehold</option>
                  <option value="leasehold">Leasehold</option>
                  <option value="customary">Customary Land Right</option>
                  <option value="stool_land">Stool Land</option>
                  <option value="indenture">Indenture</option>
                  <option value="certificate_of_title">Certificate of Title</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="ownership_document" className="text-white/60 mb-1 text-sm">
                  Ownership Document <span className="text-red-400">*</span>
                </label>
                <select
                  id="ownership_document"
                  name="ownership_document"
                  required
                  className="border-white/10 border-1 rounded-sm p-2 text-white"
                  value={formData.ownership_document}
                  onChange={handleState}
                >
                  <option value="">Select document</option>
                  <option value="site_plan">Site Plan</option>
                  <option value="land_certificate">Land Certificate</option>
                  <option value="indenture_deed">Indenture Deed</option>
                  <option value="title_deed">Title Deed</option>
                  <option value="lease_agreement">Lease Agreement</option>
                  <option value="all_documents">All Documents Available</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="payment_plan_available" className="text-white/60 mb-1 text-sm">
                  Payment Plan Available
                </label>
                <select
                  id="payment_plan_available"
                  name="payment_plan_available"
                  className="border-white/10 border-1 rounded-sm p-2 text-white"
                  value={formData.payment_plan_available}
                  onChange={handleState}
                >
                  <option value="">Select option</option>
                  <option value="full_payment">Full Payment Only</option>
                  <option value="installment_plan">Installment Plan Available</option>
                  <option value="bank_financing">Bank Financing Available</option>
                  <option value="flexible">Flexible Payment Terms</option>
                </select>
              </div>
            </div>
          )}
        </Card>
        {/* Owner Information Card */}
        <Card className="px-4 lg:p-8 bg-white/10 mb-5">
          <h3 className="text-white font-medium text-lg mb-5">Owner Information</h3>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="owner_name" className="text-white/60 mb-1 text-sm">
                Owner Name <span className="text-red-400">*</span>
              </label>
              <input
                id="owner_name"
                name="owner_name"
                type="text"
                required
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                placeholder="Enter owner's full name"
                value={formData.owner_name}
                onChange={handleState}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="owner_type" className="text-white/60 mb-1 text-sm">
                Owner Type <span className="text-red-400">*</span>
              </label>
              <select
                id="owner_type"
                name="owner_type"
                required
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                value={formData.owner_type}
                onChange={handleState}
              >
                <option value="landlord">Landlord</option>
                <option value="agent">Agent</option>
                <option value="company">Company</option>
                <option value="caretaker">Caretaker</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="owner_phone" className="text-white/60 mb-1 text-sm">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="owner_phone"
                  name="owner_phone"
                  type="tel"
                  required
                  className="border-white/10 border-1 rounded-sm p-2 text-white flex-1"
                  placeholder="e.g., +233 24 123 4567"
                  value={formData.owner_phone}
                  onChange={handleState}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="preferred_phone"
                    checked={preferredContact === "phone"}
                    onCheckedChange={(checked) => {
                      if (checked) setPreferredContact("phone");
                    }}
                  />
                  <label
                    htmlFor="preferred_phone"
                    className="text-white/60 text-xs cursor-pointer"
                  >
                    Mark as preferred
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="owner_email" className="text-white/60 mb-1 text-sm">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="owner_email"
                  name="owner_email"
                  type="email"
                  required
                  className="border-white/10 border-1 rounded-sm p-2 text-white flex-1"
                  placeholder="e.g., owner@example.com"
                  value={formData.owner_email}
                  onChange={handleState}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="preferred_email"
                    checked={preferredContact === "email"}
                    onCheckedChange={(checked) => {
                      if (checked) setPreferredContact("email");
                    }}
                  />
                  <label
                    htmlFor="preferred_email"
                    className="text-white/60 text-xs cursor-pointer"
                  >
                    Mark as preferred
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="owner_whatsapp" className="text-white/60 mb-1 text-sm">
                WhatsApp Number (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="owner_whatsapp"
                  name="owner_whatsapp"
                  type="tel"
                  className="border-white/10 border-1 rounded-sm p-2 text-white flex-1"
                  placeholder="e.g., +233 24 123 4567"
                  value={formData.owner_whatsapp}
                  onChange={handleState}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="preferred_whatsapp"
                    checked={preferredContact === "whatsapp"}
                    onCheckedChange={(checked) => {
                      if (checked) setPreferredContact("whatsapp");
                    }}
                  />
                  <label
                    htmlFor="preferred_whatsapp"
                    className="text-white/60 text-xs cursor-pointer"
                  >
                    Mark as preferred
                  </label>
                </div>
              </div>
              <span className="text-white/40 text-xs mt-1">
                Leave empty if same as phone number
              </span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="owner_address" className="text-white/60 mb-1 text-sm">
                Owner Address (Optional)
              </label>
              <input
                id="owner_address"
                name="owner_address"
                type="text"
                className="border-white/10 border-1 rounded-sm p-2 text-white"
                placeholder="Enter owner's address"
                value={formData.owner_address}
                onChange={handleState}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="owner_notes" className="text-white/60 mb-1 text-sm">
                Internal Notes (Optional)
              </label>
              <textarea
                id="owner_notes"
                name="owner_notes"
                rows="3"
                className="border-white/10 border-1 rounded-sm p-2 text-white resize-none"
                placeholder="Add any internal notes about the owner..."
                value={formData.owner_notes}
                onChange={handleState}
              />
              <span className="text-white/40 text-xs mt-1">
                These notes are only visible to admins
              </span>
            </div>
          </div>
        </Card>
        <div className="lg:hidden md:hidden flex gap-2 grid grid-cols-2 w-full mb-10">
          <button className="border border-gray-400 px-4 py-2 rounded-sm text-gray-500">
            Discard
          </button>
          <button
            disabled={loading}
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
