import "../../PetProfile/AllPets.css";
import PatientCard from "../../../components/cards/PatientCard";
import { useEffect, useState } from "react";
import { getPetById } from "../../../api/pet";
import { getProviderAppointments } from "../../../api/providerBookings";
import "./PatientList.css";
import ProviderSearchBar from "../../../components/SearchBar/ProviderSearchBar";

export default function PatientList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Controlled input states
  const [ageInput, setAgeInput] = useState("");      // what user selects/enters
  const [searchInput, setSearchInput] = useState(""); // what user types

  // Applied filters (only updated on search)
  const [ageFilter, setAgeFilter] = useState("");    
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  useEffect(() => {
    async function getAppointments() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const providerAppointments = await getProviderAppointments(token);
      const confirmedAppointments = providerAppointments.appointments.filter(
        (appt) =>
          appt.status === "CONFIRMED" || appt.status === "COMPLETED"
      );
      setAppointments(confirmedAppointments || []);
    }
    getAppointments();
  }, []);

  useEffect(() => {
    async function getPatients() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const promises = appointments.map((appt) =>
          getPetById(appt.pet_id, token)
        );
        const patientDataArray = await Promise.all(promises);

        // unique patients
        const uniquePatients = [
          ...new Set(patientDataArray.map((p) => JSON.stringify(p))),
        ].map((p) => JSON.parse(p));

        setPatients(uniquePatients);
      } catch (err) {
        console.error(err);
      }
    }

    getPatients();
  }, [appointments]);

  // Filter patients whenever the **applied filters** change
  useEffect(() => {
    let filtered = [...patients];

    if (ageFilter && ageFilter !== "All") {
      const now = new Date();

      filtered = filtered.filter(patient => {
        if (!patient.date_of_birth) return false;

        const dob = new Date(patient.date_of_birth);
        const age = (now - dob) / (1000 * 60 * 60 * 24 * 365.25);

        switch (ageFilter) {
          case "Puppies (< 1 year)":
            return age < 1;

          case "Young (1-5 years)":
            return age >= 1 && age < 5;

          case "Adult (5-10 years)":
            return age >= 5 && age < 10;

          case "Senior (10+ years)":
            return age >= 10;

          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter(p => {
        const pet = p.name?.toLowerCase() || "";
        const owner = (p.owner_name || "").toLowerCase();

        return (
          pet.includes(q) ||
          owner.includes(q) ||
          `${pet} - ${owner}`.includes(q)
        );
      });
    }

    setFilteredPatients(filtered);
  }, [patients, ageFilter, searchQuery]);

  // Trigger search when button is clicked
  const handleSearch = (ageOverride) => {
    setAgeFilter(ageOverride ?? ageInput);
    setSearchQuery(searchInput);
  };

  const handlePatientDeleted = (deletedPetId) => {
    setPatients((prev) => prev.filter((p) => p.id !== deletedPetId));
  };

  return (
    <div className="all-patients-container">
      <div className="all-patient-section">
        <div className="all-patients-content">
          <div className="patient-content-container">
            <div className="all-patients-header">
              <h1>Patients</h1>
            </div>

            <ProviderSearchBar
              patients={patients}
              service={ageInput}         
              searchValue={searchInput}     
              onServiceChange={setAgeInput} 
              onSearchChange={setSearchInput}
              onSearch={handleSearch}         
            />

            <div className="all-pets-actions-patient-list">
              <div>All({filteredPatients.length})</div>
            </div>

            <div className="pets-list">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  pet={patient}
                  onPetDeleted={handlePatientDeleted}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
