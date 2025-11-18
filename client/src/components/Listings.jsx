import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { Bed, ShowerHead, LandPlot } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function Listings({
  lgCols = 3,
  smCols = 1,
  limit = undefined,
  search = "",
  properties: propsProperties,
  setProperties: propsSetProperties,
  filters,
  setFilters,
  tags = [],
}) {
  const [loading, setLoading] = useState(true);
  const [localProperties, setLocalProperties] = useState([]);
  const properties = propsProperties ?? localProperties;
  const setProperties = propsSetProperties ?? setLocalProperties;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const perPage = 15;

  const iRef = useRef();

  useEffect(() => {
    // Don't observe if:
    // 1. No ref element
    // 2. No more data to load
    // 3. Already loading more
    // 4. Initial loading
    // 5. No properties (empty state)
    // 6. Limit is set (for fixed number of items like homepage featured properties)
    if (!iRef.current || !hasMore || isLoadingMore || loading || properties.length === 0 || limit !== undefined) {
      return;
    }

    // Check if the container is scrollable and if all items are already visible
    const checkIfScrollable = () => {
      if (!iRef.current) return false;
      
      // Find the listings container
      const listingsContainer = iRef.current.closest('[data-listings-container]');
      if (!listingsContainer) {
        // Fallback: check if window is scrollable
        const isWindowScrollable = document.documentElement.scrollHeight > window.innerHeight;
        
        // Also check if the last item is already fully visible
        const lastItemRect = iRef.current.getBoundingClientRect();
        const isLastItemVisible = lastItemRect.bottom <= window.innerHeight;
        
        // Only allow observer if window is scrollable AND last item is not fully visible
        return isWindowScrollable && !isLastItemVisible;
      }
      
      // Check if the container itself is scrollable (vertical scroll)
      const isContainerScrollable = listingsContainer.scrollHeight > listingsContainer.clientHeight;
      
      // Check if the last item is already fully visible in the container
      const lastItemRect = iRef.current.getBoundingClientRect();
      const containerRect = listingsContainer.getBoundingClientRect();
      const isLastItemVisible = lastItemRect.bottom <= containerRect.bottom;
      
      // Also check if parent has horizontal scroll (for horizontal listings)
      const parent = listingsContainer.parentElement;
      const hasHorizontalScroll = parent && (
        parent.scrollWidth > parent.clientWidth ||
        parent.classList.contains('overflow-x-auto') ||
        getComputedStyle(parent).overflowX === 'auto'
      );
      
      // For vertical infinite scroll, we need:
      // 1. Container to be scrollable
      // 2. Last item not fully visible yet
      // 3. No horizontal scroll (horizontal listings handled by limit check)
      return isContainerScrollable && !isLastItemVisible && !hasHorizontalScroll;
    };

    // Only set up observer if container is scrollable
    if (!checkIfScrollable()) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Only trigger if:
        // 1. Element is intersecting
        // 2. We're not already loading
        // 3. There's more data to load
        // 4. We have at least 1 property
        // 5. No limit is set (infinite scroll only works without limit)
        // 6. Container is still scrollable (to prevent triggering when all items fit on screen)
        if (
          entry.isIntersecting && 
          !isLoadingMore && 
          hasMore && 
          !loading && 
          properties.length > 0 && 
          limit === undefined &&
          checkIfScrollable()
        ) {
          setIsLoadingMore(true);
          setPage((prev) => prev + 1);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "100px",
        // Use root instead of viewport to check against scrollable container
        root: null 
      },
    );
    
    observer.observe(iRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loading, properties.length, limit]);

  // Use passed-in props if available, else fallback to local state
  const lgGridClass =
    {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
    }[lgCols] || "lg:grid-cols-3";

  const smGridClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3 min-w-[1000px]",
    }[smCols] || "grid-cols-3";

  // Reset page when search or filters change, then fetch
  useEffect(() => {
    setHasMore(true);
    setPage(0);
    setIsLoadingMore(false);
    // Don't fetch here - let the next effect handle it
  }, [search, filters]);

  // Fetch properties when page, search, or filters change
  useEffect(() => {
    let isCancelled = false;
    
    async function fetch() {
      setLoading(true);
      await fetchProperties(search, filters, page, isCancelled);
      // Loading state is managed inside fetchProperties
    }
    
    fetch();
    
    return () => {
      isCancelled = true;
    };
  }, [search, filters, page]);

  async function fetchProperties(search, filters, page = 0, isCancelled = false) {
    if (isCancelled) return null;
    
    const from = limit === undefined ? page * perPage : 0;
    const to = limit === undefined ? from + perPage - 1 : limit;

    let query = supabase.from("properties").select("*", { count: "exact" });

    if (filters?.listingType != "all") {
      query = query.eq("listing_type", filters.listingType);
    }

    if (filters?.propertyType != "all") {
      query = query.eq("property_type", filters.propertyType);
    }

    if (filters?.bedrooms != "any") {
      query = query.eq("bedrooms", filters.bedrooms);
    }

    if (filters?.bathrooms != "any") {
      query = query.eq("bathrooms", filters.bathrooms);
    }
    if (filters?.price) {
      query = query
        .gte("price", filters.price[0])
        .lte("price", filters.price[1]);
    }

    if (search && search.trim() !== "") {
      query = query.textSearch("fts", search, {
        config: "english",
        type: "websearch", // allows natural queries like "3 bedroom house"
      });
    }

    if (tags.length >= 1) {
      query = query.contains("tags", [...tags]);
    }

    query = query.order("created_at", { ascending: true }).range(from, to);

    let { data, error, count } = await query;

    if (isCancelled) return null;

    if (error) {
      if (!isCancelled) {
        setLoading(false);
        setIsLoadingMore(false);
      }
      return null;
    }
    
    // Check if data exists and is an array
    if (!data || !Array.isArray(data)) {
      if (!isCancelled) {
        setLoading(false);
        setIsLoadingMore(false);
        setHasMore(false);
      }
      return null;
    }
    
    // Determine if there's more data based on:
    // 1. If we got less than perPage items, there's definitely no more
    // 2. If we got exactly perPage items, check if total count suggests there's more
    // 3. Use count if available, otherwise assume there's more if we got a full page
    const hasMoreData = data.length < perPage 
      ? false 
      : (count === null ? true : (page + 1) * perPage < count);
    
    // Remove duplicates by ID before setting
    if (page === 0) {
      // For page 0, just set the data (remove any duplicates)
      const uniqueData = data.filter((item, index, self) => 
        index === self.findIndex((t) => t.id === item.id)
      );
      setProperties(uniqueData);
      // Set hasMore based on whether we got a full page
      setHasMore(hasMoreData);
    } else if (page > 0) {
      // For pagination, append but remove duplicates
      setProperties((prev) => {
        const combined = [...prev, ...data];
        // Remove duplicates by ID
        const unique = combined.filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        );
        return unique;
      });
      // Set hasMore based on whether we got a full page
      setHasMore(hasMoreData);
    }
    
    if (!isCancelled) {
      setLoading(false);
      setIsLoadingMore(false);
    }
    return true;
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${lgGridClass}  ${smGridClass}  gap-4 m-0 `}
    >
      {loading ? (
        Array.from({ length: !limit ? 5 : limit }).map((_, index) => (
          <div className="bg-white/15 rounded-3xl shadow p-4 text-white">
            <Skeleton className="w-full h-[200px] rounded-2xl" />
            <Skeleton className="h-7 w-[70%] mt-2" />
            <Skeleton className="h-4 w-[35%] mt-2" />
            <div className="flex justify-between">
              {" "}
              <Skeleton className="h-5 w-[8%] mt-2" />
              <Skeleton className="h-5 w-[8%] mt-2" />
              <Skeleton className="h-5 w-[8%] mt-2" />
              <div className="w-15"></div>
              <Skeleton className="h-6 w-[45%] mt-2" />
            </div>
          </div>
        ))
      ) : properties.length > 0 ? (
        properties.slice(0, limit).map((p, index) => {
          const isLastItem = index === properties.length - 1;
          // Only attach ref to last item if:
          // 1. It's actually the last item
          // 2. We have more data to load
          // 3. We're not currently loading
          // 4. No limit is set (infinite scroll only works without limit)
          const shouldAttachRef = isLastItem && hasMore && !isLoadingMore && !loading && limit === undefined;
          
          return (
          <Link to={`/listing/${p.id}`} key={p.id}>
            <div
              className="bg-white/15 rounded-3xl shadow p-4 text-white"
              ref={shouldAttachRef ? iRef : null}
            >
              <img
                src={p.images?.[0]}
                alt={`${p.title || "Property"} - ${p.location || "Ghana"} - ${p.bedrooms || 0} bedroom ${p.property_type || "property"} for ${p.listing_type || "sale"}`}
                className="w-full h-[200px] object-cover rounded-2xl"
                loading="lazy"
              />
              <h2 className="text-md font-medium mt-2 text-white">{p.title}</h2>
              <p className="text-white/60 text-sm">{p.location}</p>
              <div className="flex justify-between items-center">
                <div className="flex gap-3 text-xs items-center">
                  <div className="flex text-white gap-1.5 items-center">
                    <div className="text-blue-500">
                      <Bed size={16} />
                    </div>{" "}
                    {p.bedrooms}
                  </div>{" "}
                  <div className="flex">
                    {" "}
                    <div className="text-blue-500">
                      <ShowerHead size={16} />
                    </div>
                    {p.bathrooms}
                  </div>{" "}
                  <div className="flex">
                    <div className="text-blue-500">
                      <LandPlot size={16} />
                    </div>{" "}
                    {p.size}
                  </div>
                </div>
                <p className="mt-2 font-bold text-blue-500">
                  {p.listing_type === "rent"
                    ? `GH₵${Number(p.price).toLocaleString("en-GH")}/month`
                    : `USD$${Number(p.price).toLocaleString("en-GH")}`}
                </p>
              </div>
            </div>
          </Link>
          );
        })
      ) : (
        <div className="h-[50vh] flex flex-col justify-center">
          <p className="text-white text-center text-2xl font-medium">
            Oops! 😕 No properties found.
          </p>
          <p className="text-white text-center text-sm">
            Try checking for typos or spelling errors, or use different filters
            or search terms to explore more properties.
          </p>
        </div>
      )}
    </div>
  );
}

function smallLisings() {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${lgGridClass}  ${smGridClass}  gap-4 m-0 `}
    >
      {properties.slice(0, limit).map((p, index) => (
        <Link to={`/listing/${p.id}`}>
          <div
            key={p.id}
            className="bg-white/15 rounded-3xl shadow p-4 text-white"
          >
            <img
              src={p.images?.[0]}
              alt={`${p.title || "Property"} - ${p.location || "Ghana"} - ${p.bedrooms || 0} bedroom ${p.property_type || "property"} for ${p.listing_type || "sale"}`}
              className="w-full h-[200px] object-cover rounded-2xl"
              loading="lazy"
            />
            <h2 className="text-md font-medium mt-2 text-white">{p.title}</h2>
            <p className="text-white/60 text-sm">{p.location}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-3 text-xs items-center">
                <div className="flex text-white gap-1.5 items-center">
                  <div className="text-blue-500">
                    <Bed size={16} />
                  </div>{" "}
                  {p.bedrooms}
                </div>{" "}
                <div className="flex">
                  {" "}
                  <div className="text-blue-500">
                    <ShowerHead size={16} />
                  </div>
                  {p.bathrooms}
                </div>{" "}
                <div className="flex">
                  <div className="text-blue-500">
                    <LandPlot size={16} />
                  </div>{" "}
                  {p.size}
                </div>
              </div>
              <p className="mt-2 font-bold text-blue-500">
                {p.listing_type === "rent"
                  ? `GH₵${Number(p.price).toLocaleString("en-GH")}/month`
                  : `USD$${Number(p.price).toLocaleString("en-GH")}`}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Listings;
