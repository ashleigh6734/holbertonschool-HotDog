import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchButton from "../../components/SearchBar/SearchButton.jsx";
import ServicesFilters_Card from "./ServicesFilters_Card.jsx";
import { resolveApiImageUrl } from "../../utils/mediaUrl.js";
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

  function formatTo12Hour(time24) {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = Number(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (inputService) params.append("service_type", inputService);
        if (inputQuery) params.append("name", inputQuery);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/providers?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }

        const data = await response.json();

        // get today's date
        const today = new Date().toISOString().split("T")[0];

        // fetch slots for each provider
        const providersWithSlots = await Promise.all(
          data.map(async (p) => {
            try {
              const slotRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/providers/${p.id}/slots?date=${today}`
              );

              if (!slotRes.ok) return { ...p, available_slots: [] };

              const slotData = await slotRes.json();

              return {
                ...p,
                available_slots: slotData.available_slots.slice(0, 3)
              };
            } catch {
              return { ...p, available_slots: [] };
            }
          })
        );

        setProviders(providersWithSlots);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [inputService, inputQuery]);

  const handleServiceChange = (value) => setInputService(value);
  const handleSearchChange = (value) => setInputQuery(value);

  const handleSearch = () => {
    setServiceType(inputService);
    setQuery(inputQuery);

    const params = new URLSearchParams();
    if (inputService) params.append("service_type", inputService);
    if (inputQuery) params.append("name", inputQuery);

    navigate(`/services?${params.toString()}`);
  };

  return (
    <div className="service-container">
      <div className="service-content">

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
                logo_url={resolveApiImageUrl(p.logo_url, import.meta.env.VITE_API_URL)}
                avgrating={p.rating}
                days="Mon–Fri"
                times={`${p.opening_time} - ${p.closing_time}`}
                isOpen={isProviderOpen(p.opening_time, p.closing_time)}
                availability={p.available_slots || []} // <-- Pass raw time strings
                onSlotClick={(time) =>
                  navigate(`/appointments/${p.id}`, { state: { preselectedTime: time } })
                }
                booknowbtn={true}
                bookNow={() => navigate(`/appointments/${p.id}`)}
              />
            ))
          ) : (
            !loading && <p>No results found</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Services;
