import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import fetch_Data from "./fetch_Data";
import service_Lists from "./services_Lists";
import "./searchbar.css";


function SearchButton({ onServiceChange, onSearchChange, onSearch, service, searchValue }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [serviceInput, setServiceInput] = useState(service || "");
  const [providerInput, setProviderInput] = useState(searchValue || "");
  const [serviceResults, setServiceResults] = useState([]);
  const [providerResults, setProviderResults] = useState([]);
  const [showServices, setShowServices] = useState(false);
  const [showProviders, setShowProviders] = useState(false);

  //select a service dropdown
  const handleServiceInput = (value) => {
    setServiceInput(value);
    onServiceChange?.(value);

    if (value.trim()) {
      setProviderInput("");
      onSearchChange?.("");
    }

    if (!value.trim()) {
      setServiceResults([]);
      setShowServices(false);
      return;
    }

    const filtered = service_Lists.filter((service) =>
      service.toLowerCase().includes(value.toLowerCase())
    );

    setServiceResults(filtered);
    setShowServices(true);
  };

  const selectService = (service) => {
    setServiceInput(service);
    onServiceChange?.(service);

    setProviderInput("");
    onSearchChange?.("");

    setTimeout(() => setShowServices(false), 0);

    // if (location.pathname === "/") {
    //   const params = new URLSearchParams();
    //   params.append("search", service);
    //   navigate(`/search?${params.toString()}`);
    // }
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

    const filtered = fetch_Data.filter((provider) =>
      provider.toLowerCase().includes(value.toLowerCase())
    );

    setProviderResults(filtered);
    setShowProviders(true);
  };

  const selectProvider = (provider) => {
    setProviderInput(provider);
    onSearchChange?.(provider);

    setServiceInput("");
    onServiceChange?.("");

    setShowProviders(false);

    // if (location.pathname === "/") {
    //   const params = new URLSearchParams();
    //   params.append("provider", provider);
    //   navigate(`/services?${params.toString()}`)
    // }
  };

  //search button
  const handleSearch = () => {
    if (onSearch) onSearch();

    if (location.pathname === "/") {
      const params = new URLSearchParams();
      if (serviceInput) params.append("service", serviceInput);
      if (providerInput) params.append("provider", providerInput);

      navigate(`/services?${params.toString()}`);
    }
  };


  return (
    <div className="search-bar-wrapper">

      {/* Search bar */}
      <div className="search-bar">
        {/* Service selector */}
        <input
          type="text"
          placeholder="Select a Service"
          value={serviceInput}
          readOnly
          onChange={(e) => handleServiceInput(e.target.value)}
          onFocus={() => {
            setServiceResults(service_Lists);
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
            width="30"
            height="30"
            viewBox="0 0 16 16"
            fill="currentColor"
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
