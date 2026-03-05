import React, { useState, useEffect } from "react";
import "./bookingsteps.css";

function BookingSteps1({ closePopup, onNext, services }) { 
  const [pets, setPets] = useState([]);
  const [values, setValues] = useState({
    pet_id: "",
    booking_type: "",
  });
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please login.");
        setLoadingPets(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/pets/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          console.error("Unauthorized! Please login again.");
          setLoadingPets(false);
          return;
        }

        const data = await res.json();

        // Ensure pets is always an array
        const petsArray = Array.isArray(data) ? data : data.pets || [];
        setPets(petsArray);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.pet_id || !values.booking_type) {
      alert("Please select a pet and booking type.");
      return;
    }

    const selectedPet = pets.find(pet => pet.id === values.pet_id);

    onNext({
      pet_id: values.pet_id,
      pet_name: selectedPet?.name || "",
      booking_type: values.booking_type,
    });
  };

  return (
    <div className="bookingsequence-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="pet_id">Which pet is appointment for?*</label>
        <select
          name="pet_id"
          id="pet_id"
          value={values.pet_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a pet</option>
          {loadingPets ? (
            <option disabled>Loading pets...</option>
          ) : pets.length > 0 ? (
            pets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species})
              </option>
            ))
          ) : (
            <option disabled>No pets available</option>
          )}
        </select>

        <label htmlFor="booking_type">Booking Type*</label>
        <select
          name="booking_type"
          id="booking_type"
          value={values.booking_type}
          onChange={handleChange}
          required
        >
          <option value="">Select a type</option>

          {services && services.length > 0 ? (
            services.map((service, idx) => {
              const serviceName =
                typeof service === "string"
                  ? service
                  : service?.service_type?.value || "Unknown Service";

              return (
                <option key={idx} value={serviceName}>
                  {serviceName}
                </option>
              );
            })
          ) : (
            <option disabled>No services available</option>
          )}
        </select>

        <div className="button-group">
          <button type="button" onClick={closePopup} className="bookingsequence-cancelbutton">Cancel</button>
          <button type="submit" className="bookingsequence-submitbutton" disabled={!values.pet_id || !values.booking_type}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingSteps1;