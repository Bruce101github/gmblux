import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, submittedSearch, setSubmittedSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
