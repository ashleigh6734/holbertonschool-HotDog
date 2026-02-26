import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import service_Lists, { service_ListsWithAll } from "./services_Lists.js";
import "./searchbar.css";
import Fuse from "fuse.js";


function SearchButton({ onServiceChange, onSearchChange, onSearch, service, searchValue }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [serviceInput, setServiceInput] = useState(service || "");
  const [providerInput, setProviderInput] = useState(searchValue || "");
  const [serviceResults, setServiceResults] = useState([]);
  const [providerResults, setProviderResults] = useState([]);
  const [showServices, setShowServices] = useState(false);
  const [showProviders, setShowProviders] = useState(false);

  const [allProviders, setAllProviders] = useState([]);
  const [fuse, setFuse] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchProviderNames = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/providers");
        const data = await res.json();

        const names = data.map((p) => p.name);
        setAllProviders(names);

        const fuseInstance = new Fuse(names, {
          threshold: 0.35,      // stricter but still typo-tolerant
          ignoreLocation: true,
          minMatchCharLength: 2,
        });

        setFuse(fuseInstance);

      } catch (err) {
        console.error("Failed to fetch provider names:", err);
      }
    };

    fetchProviderNames();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowServices(false);
        setShowProviders(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //select a service dropdown
  const handleServiceInput = (value) => {
    setServiceInput(value);
    onServiceChange?.(value);

    if (!value.trim()) {
      setServiceResults(service_ListsWithAll);
      setShowServices(true);
      return;
    }

    const filtered = service_ListsWithAll.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    );

    setServiceResults(filtered);
    setShowServices(true);
  };

  const selectService = (service) => {
    setServiceInput(service);
    setProviderInput("");
    onSearchChange?.("");

    if (service === "All Services" || !service) {
      onServiceChange?.("");
    } else {
      onServiceChange?.(service);
    }

    setShowServices(false);
  };

  // Search by provider names 
  const handleProviderInput = (value) => {
    setProviderInput(value);
    onSearchChange?.(value);

    if (value.trim()) {
      setServiceInput("");
      onServiceChange?.("");
    }

    if (!value.trim()) {
      setProviderResults([]);
      setShowProviders(false);
      return;
    }

    let results = [];

    if (fuse) {
      results = fuse.search(value).map(r => r.item);
    }

    if (results.length === 0) {
      results = allProviders.filter(p =>
        p.toLowerCase().includes(value.toLowerCase())
      );
    }

    setProviderResults(results);
    setShowProviders(true);
  };

  const selectProvider = (provider) => {
    setProviderInput(provider);
    onSearchChange?.(provider);

    setServiceInput("");
    onServiceChange?.("");

    setShowProviders(false);
  };

  //search button
  const handleSearch = () => {
    if (!serviceInput.trim() && !providerInput.trim()) return;
    if (onSearch) onSearch();

    const params = new URLSearchParams();

    if (serviceInput && serviceInput !== "All Services") {
      params.append("service", serviceInput);
    }

    if (providerInput) {
      params.append("provider", providerInput);
    }

    if (location.pathname === "/") {
      navigate(`/services?${params.toString()}`);
    }
  };


  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>

      {/* Search bar */}
      <div className="search-bar">

        <div>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`dropdown-icon ${showServices ? "open" : ""}`}
          onClick={() => {
              // if (showServices) setShowServices(false);
              // else {
                setServiceResults(service_ListsWithAll); 
                setShowServices(!showServices);
              // }
            }}
          >
            <polyline points="6 9 12 3 18 9"></polyline>
          </svg>
        </div>
        

        {/* Service selector */}
        <input
          type="text"
          placeholder="Select a Service"
          value={serviceInput}
          readOnly
          onChange={(e) => handleServiceInput(e.target.value)}
          onFocus={() => {
            setServiceResults(service_ListsWithAll);
            setShowServices(true);
          }}
          className="provider-search-filter"
        />
        
        {showServices && (
          <ul className="service-results">
            {/* {serviceResults.length > 0 &&  */}
              {serviceResults.map((service, idx) => (
                <li
                  key={idx}
                  className="service-item"
                  onClick={() => selectService(service)}
                >
                  {service}
                </li>
              ))}
          </ul>
        )}


        {/* Search button */}
        <button className="search-btn" onClick={handleSearch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="searchbar-icon"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </button>


        {/* Provider Search Input */}
        <input
          type="text"
          placeholder="Search Provider by name"
          value={providerInput}
          onChange={(e) => handleProviderInput(e.target.value)}
          className="provider-search-filter"
        />
        {showProviders && (
          <ul className="search-results">
            {providerResults.length > 0 ? (
              providerResults.map((provider, idx) => (
                <li
                  key={idx}
                  className="result-item"
                  onClick={() => selectProvider(provider)}
                >
                  {provider}
                </li>
              ))
            ) : (
              <li className="no-results">No providers found</li>
            )}
          </ul>
        )}

      </div>
    </div>
  );
}

export default SearchButton;
