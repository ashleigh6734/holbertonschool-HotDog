import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchButton from "../../components/SearchBar/SearchButton.jsx";
import ServicesFilters_Card from "./ServicesFilters_Card.jsx";
import searchFilter_Data from "./searchFilter_Data.js";
import "./servicesStyle.css";

function createCard(props) {
  return <ServicesFilters_Card key={props.id} {...props} />;
}

function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialService = queryParams.get("service") || "";
  const initialProvider = queryParams.get("provider") || "";

  const [serviceType, setServiceType] = useState(initialService);
  const [query, setQuery] = useState(initialProvider);
  const [filteredData, setFilteredData] = useState(searchFilter_Data);
  // const [query, setQuery] = useState("");
  // const [serviceType, setServiceType] = useState("");
  // const [filteredData, setFilteredData] = useState(searchFilter_Data);

  // const handleSearchChange = (value) => setQuery(value);
  // const handleServiceChange = (value) => setServiceType(value);


  useEffect(() => {
    const keyword = query.toLowerCase();
    const results = searchFilter_Data.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword);
      const matchesService = serviceType ? item.servicetype === serviceType : true;
      return matchesQuery && matchesService;
    });
    setFilteredData(results);
  }, [query, serviceType]);

  const handleServiceChange = (value) => setServiceType(value);
  const handleSearchChange = (value) => setQuery(value);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (serviceType) params.append("service", serviceType);
    if (query) params.append("provider", query);
    navigate(`/services?${params.toString()}`);
  };


  // const handleSearch = () => {
  //   const keyword = query.toLowerCase();
  //   const results = searchFilter_Data.filter((item) => {
  //     const matchesQuery =
  //       item.title.toLowerCase().includes(keyword) ||
  //       item.address.toLowerCase().includes(keyword);
  //     const matchesService = serviceType ? item.servicetype === serviceType : true;
  //     return matchesQuery && matchesService;
  //   });

  //   setFilteredData(results);
  // };

  return (
    <div className="service-container">
      <SearchButton
        service={serviceType}
        searchValue={query}
        onServiceChange={handleServiceChange}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />

      <div className="service-title-card-container">
        <p className="service-card-title">Practices</p>
      </div>

      <div className="service-cards-container">
        {filteredData.length > 0 ? filteredData.map(createCard) : <p>No results found</p>}
      </div>
    </div>
  );
}

export default Services;