import "../../PetProfile/AllPets.css";
import PetCard from "../../../components/cards/PetCard";
import { useEffect, useState } from "react";
import { getPetById } from "../../../api/pet";
import { getProviderAppointments } from "../../../api/providerBookings";
import "./PatientList.css";

export default function PatientList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    async function getAppointments() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const providerAppointments = await getProviderAppointments(token);
      setAppointments(providerAppointments.appointments || []);
    }
    getAppointments();
  }, []);

  // pass patientsID into getPetByID

  useEffect(() => {
    async function getPatients() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const promises = appointments.map((appointment) =>
          getPetById(appointment.pet_id, token),
        );
        const patientDataArray = await Promise.all(promises);
        setPatients(patientDataArray);
      } catch (error) {
        console.error(error);
      }
    }

    getPatients();
  }, [appointments]);

  return (
    <div className="all-patients-container">
      <div className="all-pets-content">
        <div className="all-pets-header">
          <h2>Patients</h2>
        </div>
        <div className="all-pets-actions">
          <div>All({patients.length})</div>
          {/* <button className="btn-yellow">+ Add Pet(s)</button> */}
        </div>

        <div className="pets-list">
          {patients.map((patient) => (
            <PetCard key={patient.id} pet={patient} />
          ))}
        </div>
      </div>
    </div>
  );
}
