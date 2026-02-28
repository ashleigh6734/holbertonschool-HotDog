import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchButton from "../../components/SearchBar/SearchButton.jsx";
import ServicesFilters_Card from "./ServicesFilters_Card.jsx";
// import searchFilter_Data from "./searchFilter_Data.js";
import "./servicesStyle.css";

function isProviderOpen(openingTimeStr, closingTimeStr) {
  if (!openingTimeStr || !closingTimeStr) return false;

  const now = new Date();

  const [openHour, openMinute] = openingTimeStr.split(":").map(Number);
  const [closeHour, closeMinute] = closingTimeStr.split(":").map(Number);

  const openTime = new Date(now);
  openTime.setHours(openHour, openMinute, 0, 0);

  const closeTime = new Date(now);
  closeTime.setHours(closeHour, closeMinute, 0, 0);

  return now >= openTime && now <= closeTime;
}


function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialService = queryParams.get("service") || "";
  const initialProvider = queryParams.get("provider") || "";

  const [serviceType, setServiceType] = useState(initialService);
  const [query, setQuery] = useState(initialProvider);

  const [inputService, setInputService] = useState(initialService);
  const [inputQuery, setInputQuery] = useState(initialProvider);

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // if (serviceType) params.append("service_type", serviceType);
        // if (query) params.append("name", query);
        if (inputService) params.append("service_type", inputService);
        if (inputQuery) params.append("name", inputQuery);

        const response = await fetch(
          `http://localhost:5000/api/providers?${params.toString()}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }

        const data = await response.json();
        setProviders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [serviceType, query]);



  const handleServiceChange = (value) => setInputService(value);
  const handleSearchChange = (value) => setInputQuery(value);

  const handleSearch = () => {
    setServiceType(inputService);
    setQuery(inputQuery);

    const params = new URLSearchParams();
    if (serviceType) params.append("service_type", serviceType); 
    if (query) params.append("name", query);
    navigate(`/services?${params.toString()}`);
  };


  return (
    <div className="service-container">
      <SearchButton
        service={inputService}
        searchValue={inputQuery}
        onServiceChange={handleServiceChange}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />

      <div className="service-title-card-container">
        <p className="service-card-title">Providers</p>
      </div>

      <div className="service-cards-container">
        {loading && <p>loading...</p>}

        {error && <p>{error}</p>}

        {!loading && providers.length > 0 ? (
          providers.map((p) => (
            <ServicesFilters_Card
              key={p.id}
              title={p.name} 
              address={p.address}
              phone={p.phone} 
              logo_url={p.logo_url}  
              avgrating={p.rating}
              days="Mon–Fri"
              times={`${p.opening_time} - ${p.closing_time}`}
              isOpen={isProviderOpen(p.opening_time, p.closing_time)}
              availability="9:00 10:00 11:00"
              booknowbtn={true}
              bookNow={() => navigate(`/appointments/${p.id}`)}
            />
          ))
        ) : ( 
          !loading && <p>No results found</p>
        )}

      </div>
    </div>
  );
}

export default Services;