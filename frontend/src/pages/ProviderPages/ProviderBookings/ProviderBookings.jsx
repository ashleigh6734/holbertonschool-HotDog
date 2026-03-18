import "./ProviderBookings.css";
import UpcomingEvents from "../../../components/ProviderSideAppointments/UpcomingEvents";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DateStep from "../../Appointments/DateStep";
import TimeStep from "../../Appointments/BookingTimeStep/BookingTimeStep";
import {
  createCustomerAndPetFromProvider,
  createProviderBooking,
  getProviderAppointments,
  getProviderProfile,
  searchOwnerPets,
} from "../../../api/providerBookings";

dayjs.extend(utc);
const API_URL = import.meta.env.VITE_API_URL;

function sortAppointmentsByDateTime(items = []) {
  return [...items].sort((a, b) => {
    const aTs = dayjs(a.date_time).valueOf();
    const bTs = dayjs(b.date_time).valueOf();
    return aTs - bTs;
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ProviderBookings() {
  const token = localStorage.getItem("token");
  const [provider, setProvider] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [eventsTableVersion, setEventsTableVersion] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [existingOwner, setExistingOwner] = useState("yes");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ownerResult, setOwnerResult] = useState(null);
  const [lookupError, setLookupError] = useState("");

  const [selectedPetId, setSelectedPetId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [intakeData, setIntakeData] = useState({

    owner: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    },
    pet: {
      name: "",
      species: "",
      breed: "",
      gender: "",
      desexed: false,
      date_of_birth: "",
      weight: "",
      notes: "",
    },
  });

  const services = useMemo(() => provider?.services || [], [provider]);
  const breedOptions = useMemo(() => {
    if (!intakeData.pet.species) {
      return [];
    }
    if (intakeData.pet.species === "cat") {
      return [
        "domestic_shorthair",
        "domestic_longhair",
        "bengal",
        "siamese",
        "mixed",
      ];
    }
    return [
      "labrador",
      "golden_retriever",
      "german_shepherd",
      "bulldog",
      "mixed",
    ];
  }, [intakeData.pet.species]);

  const resetForm = () => {
    setExistingOwner("yes");
    setEmail("");
    setPhone("");
    setOwnerResult(null);
    setLookupError("");
    setSelectedPetId("");
    setServiceType("");
    setSelectedDate(dayjs());
    setAvailableTimes([]);
    setSelectedTime("");
    setNotes("");
    setSubmitError("");
    setIntakeData({
      owner: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      },
      pet: {
        name: "",
        species: "",
        breed: "",
        gender: "",
        desexed: false,
        date_of_birth: "",
        weight: "",
        notes: "",
      },
    });
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const closeModalAfterBooking = async () => {
    setShowModal(false);
    setExistingOwner("yes");
    setEmail("");
    setPhone("");
    setOwnerResult(null);
    setLookupError("");
    setSelectedPetId("");
    setServiceType("");
    setSelectedTime("");
    setNotes("");
    setSubmitError("");
    setIntakeData({
      owner: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      },
      pet: {
        name: "",
        species: "",
        breed: "",
        gender: "",
        desexed: false,
        date_of_birth: "",
        weight: "",
        notes: "",
      },
    });

    // Ensure table reflects freshest backend state after modal closes.
    await loadAppointments({ forceRefresh: true });
    setEventsTableVersion((prev) => prev + 1);
  };

  const loadAppointments = useCallback(async ({ forceRefresh = false } = {}) => {
    if (!token) {
      return [];
    }
    const response = await getProviderAppointments(token, "", { cacheBust: forceRefresh });
    const nextAppointments = sortAppointmentsByDateTime(response.appointments || []);
    setAppointments(nextAppointments);
    return nextAppointments;
  }, [token]);

  const refreshUntilAppointmentVisible = useCallback(
    async (appointmentId) => {
      if (!appointmentId) {
        await loadAppointments({ forceRefresh: true });
        return;
      }

      const retryDelays = [0, 1000, 3000];
      for (const delay of retryDelays) {
        if (delay > 0) {
          await wait(delay);
        }
        const latest = await loadAppointments({ forceRefresh: true });
        const found = latest.some((appt) => appt.id === appointmentId);
        if (found) {
          return;
        }
      }
    },
    [loadAppointments],
  );

  const loadAvailableTimes = async (date = selectedDate) => {
    if (!provider?.id || !date) {
      return;
    }

    try {
      const formattedDate = date.format("YYYY-MM-DD");
      const response = await fetch(
        `${API_URL}/api/providers/${provider.id}/slots?date=${formattedDate}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch slots");
      }
      const slots = Array.isArray(data.slots)
        ? data.slots
        : (data.available_slots || []).map((time) => ({
            time,
            is_booked: false,
          }));
      setAvailableTimes(slots);
    } catch (error) {
      console.error(error);
      setAvailableTimes([]);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const load = async () => {
      try {
        const providerData = await getProviderProfile(token);
        setProvider(providerData);
        await loadAppointments();
      } catch (error) {
        console.error(error.message);
      }
    };

    load();
  }, [token, loadAppointments]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const intervalId = setInterval(() => {
      loadAppointments();
    }, 30000);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        loadAppointments();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, [token, loadAppointments]);

  useEffect(() => {
    loadAvailableTimes(selectedDate);
  }, [provider, selectedDate]);

  const buildDateTimeFromSlot = () => {
    const match = selectedTime.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
    if (!match) {
      throw new Error("Invalid time slot format");
    }

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3];

    if (meridiem === "PM" && hour !== 12) {
      hour += 12;
    }
    if (meridiem === "AM" && hour === 12) {
      hour = 0;
    }

    // Slots are generated by backend in UTC labels (e.g. 1:00PM = 13:00 UTC).
    // Build ISO datetime as UTC directly to avoid local-time offset drift.
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return dayjs.utc(`${dateStr}T${hh}:${mm}:00Z`).toISOString();
  };

  const handleOwnerLookup = async () => {
    setLookupError("");
    setOwnerResult(null);
    setSelectedPetId("");

    try {
      const data = await searchOwnerPets(token, { email, phone });
      setOwnerResult(data);
    } catch (error) {
      setLookupError(error.message);
    }
  };

  const handleCreateBooking = async () => {
    setSubmitError("");

    try {
      let bookingPetId = selectedPetId;
      if (existingOwner === "no") {
        const intakePayload = {
          owner: {
            first_name: intakeData.owner.first_name,
            last_name: intakeData.owner.last_name,
            email: intakeData.owner.email,
            phone_number: intakeData.owner.phone_number || null,
          },
          pet: {
            name: intakeData.pet.name,
            species: intakeData.pet.species,
            breed: intakeData.pet.breed,
            gender: intakeData.pet.gender,
            desexed: intakeData.pet.desexed,
            date_of_birth: intakeData.pet.date_of_birth || null,
            weight: intakeData.pet.weight === "" ? null : Number(intakeData.pet.weight),
            notes: intakeData.pet.notes || null,
          },
        };

        const created = await createCustomerAndPetFromProvider(token, intakePayload);
        bookingPetId = created.pet.id;
      }

      const dateTime = buildDateTimeFromSlot();
      const createdBooking = await createProviderBooking(token, {
        pet_id: bookingPetId,
        service_type: serviceType,
        date_time: dateTime,
        notes,
      });

      if (createdBooking?.booking) {
        setAppointments((prev) => {
          const withoutDuplicate = prev.filter((appt) => appt.id !== createdBooking.booking.id);
          return sortAppointmentsByDateTime([...withoutDuplicate, createdBooking.booking]);
        });
      }

      // Reconcile with backend source of truth with short retries.
      await refreshUntilAppointmentVisible(createdBooking?.booking?.id);
      await loadAvailableTimes(selectedDate);
      await closeModalAfterBooking();
    } catch (error) {
      setSubmitError(error.message);
    }
  };



  // Business insights
  const clientStats = useMemo(() => {
    const uniqueOwners = new Map();

    appointments.forEach((appt) => {
      const owner = appt.pet_owner_name;
      const date = dayjs(appt.date_time);

      if (!owner) return;

      if (!uniqueOwners.has(owner)) {
        uniqueOwners.set(owner, []);
      }

      uniqueOwners.get(owner).push(date);
    });

    const totalClients = uniqueOwners.size;

    const startOfWeek = dayjs().startOf("week");

    let newClientsThisWeek = 0;
    let repeatClients = 0;

    uniqueOwners.forEach((dates) => {
      const sortedDates = dates.sort((a, b) => a.valueOf() - b.valueOf());
      const firstVisit = sortedDates[0];

      if (firstVisit.isAfter(startOfWeek)) {
        newClientsThisWeek++;
      }

      if (dates.length > 1) {
        repeatClients++;
      }
    });

    return {
      totalClients,
      newClientsThisWeek,
      repeatClients,
    };
  }, [appointments]);

  return (
    <div className="provider-container-background">
      <div className="provider-booking-section">
        <div className="wrapper-container">
          <div className="bookings-header-bar">
            <h1 className="my-auto">Appointments</h1>
          </div>
          
          {/* Buiness Insights */}
          <div className="client-stats-container">
            <div className="stat-card">
              <div className="small-stat">
                <h3>{clientStats.newClientsThisWeek}</h3>
                <p>New Clients This Week</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="large-stat">
                <h3>{clientStats.totalClients}</h3>
                <p>Total Clients</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="small-stat"> 
                <h3>{clientStats.repeatClients}</h3>
                <p>Repeat Clients</p>
              </div>
            </div>
          </div>

          {/* Appointment data */}
          <div className="upcoming-appointments-container">
            <p>View and manage all your upcoming appointments in one place:</p>
            <div className="upcoming-appointments-table">
              <UpcomingEvents upcomingEvents={appointments} />
            </div>
          </div>

          <div className="create-booking-row">
            <button className="create-booking-btn" onClick={() => setShowModal(true)}>
              Create an appointment
            </button>
          </div>

          {showModal && (
            <div className="provider-modal-overlay">
              <div className="provider-modal">
                <button className="provider-modal-close" onClick={closeModal}>
                  x
                </button>

                <h3 className="provider-modal-title">New Booking</h3>

                <div className="provider-modal-block">
                  <p className="label-title">Have they been to your clinic before?</p>
                  <div className="provider-radio-row">
                    <label>
                      <input
                        type="radio"
                        checked={existingOwner === "yes"}
                        onChange={() => setExistingOwner("yes")}
                      />{" "}
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={existingOwner === "no"}
                        onChange={() => setExistingOwner("no")}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>

                {existingOwner === "yes" && (
                  <div className="provider-modal-block">
                    <p className="label-title">Find owner (email or phone)</p>
                    <input
                      className="provider-input"
                      placeholder="Owner email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="provider-input"
                      placeholder="Owner phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button className="provider-secondary-btn" onClick={handleOwnerLookup}>
                      Search
                    </button>
                    {lookupError && <p className="provider-error">{lookupError}</p>}
                  </div>
                )}

                {existingOwner === "no" && (
                  <div className="provider-modal-block">
                    <p>Create new customer and pet</p>
                    <div className="provider-grid-2">
                      <input
                        className="provider-input"
                        placeholder="Owner first name"
                        value={intakeData.owner.first_name}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          owner: { ...prev.owner, first_name: e.target.value },
                        }))}
                      />
                      <input
                        className="provider-input"
                        placeholder="Owner last name"
                        value={intakeData.owner.last_name}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          owner: { ...prev.owner, last_name: e.target.value },
                        }))}
                      />
                    </div>
                    <div className="provider-grid-2">
                      <input
                        className="provider-input"
                        placeholder="Owner email"
                        value={intakeData.owner.email}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          owner: { ...prev.owner, email: e.target.value },
                        }))}
                      />
                      <input
                        className="provider-input"
                        placeholder="Owner phone (optional)"
                        value={intakeData.owner.phone_number}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          owner: { ...prev.owner, phone_number: e.target.value },
                        }))}
                      />
                    </div>

                    <div className="provider-grid-2">
                      <input
                        className="provider-input"
                        placeholder="Pet name"
                        value={intakeData.pet.name}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          pet: { ...prev.pet, name: e.target.value },
                        }))}
                      />
                      <select
                        className="provider-select"
                        value={intakeData.pet.species}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          pet: { ...prev.pet, species: e.target.value, breed: "" },
                        }))}
                      >
                        <option value="" disabled>
                          Select species
                        </option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                      </select>
                    </div>

                    <div className="provider-grid-2">
                      <select
                        className="provider-select"
                        value={intakeData.pet.breed}
                        disabled={!intakeData.pet.species}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          pet: { ...prev.pet, breed: e.target.value },
                        }))}
                      >
                        <option value="" disabled>
                          Select breed
                        </option>
                        {breedOptions.map((breed) => (
                          <option key={breed} value={breed}>
                            {breed}
                          </option>
                        ))}
                      </select>
                      <select
                        className="provider-select"
                        value={intakeData.pet.gender}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          pet: { ...prev.pet, gender: e.target.value },
                        }))}
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="unknown">Unknown</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div className="provider-grid-2">
                      <input
                        className="provider-input"
                        type="date"
                        value={intakeData.pet.date_of_birth}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          pet: { ...prev.pet, date_of_birth: e.target.value },
                        }))}
                      />
                      <input
                        className="provider-input"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Weight kg (optional)"
                        value={intakeData.pet.weight}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          pet: { ...prev.pet, weight: e.target.value },
                        }))}
                      />
                    </div>

                    <label className="provider-checkbox-row">
                      <input
                        type="checkbox"
                        checked={intakeData.pet.desexed}
                        onChange={(e) => setIntakeData((prev) => ({
                          ...prev,
                          pet: { ...prev.pet, desexed: e.target.checked },
                        }))}
                      />
                      Desexed
                    </label>

                    <textarea
                      className="provider-notes"
                      placeholder="Pet notes (optional)"
                      value={intakeData.pet.notes}
                      onChange={(e) => setIntakeData((prev) => ({
                        ...prev,
                        pet: { ...prev.pet, notes: e.target.value },
                      }))}
                    />
                  </div>
                )}

                {ownerResult && (
                  <div className="provider-modal-block">
                    <p>
                      Owner: {ownerResult.owner.first_name} {ownerResult.owner.last_name}
                    </p>
                    <label htmlFor="pet-select">Which pet is appointment for?</label>
                    <select
                      id="pet-select"
                      className="provider-select"
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                    >
                      <option value="">Select pet</option>
                      {ownerResult.pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="provider-modal-block">
                  <label className="label-title" htmlFor="service-select">Booking Type</label>
                  <select
                    id="service-select"
                    className="provider-select"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  >
                    <option value="">Select booking type</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="provider-bookings-container">
                  <div className="date-container">
                    <DateStep
                      value={selectedDate}
                      onChange={setSelectedDate}
                      sx={{
                        margin: 0,
                        padding: 0,
                        transform: "scale(1.05)",
                        alignSelf: "flex-start",
                      }}
                    />
                  </div>
                  <div className="time-container">
                    <TimeStep
                      selectedTime={selectedTime}
                      setSelectedTime={setSelectedTime}
                      times={availableTimes}
                    />
                  </div>
                </div>

                <textarea
                  className="provider-notes"
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                {submitError && <p className="provider-error">{submitError}</p>}

                <div className="modal-actions">
                  <button className="modal-btn-cancel" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className="modal-btn-book"
                    onClick={handleCreateBooking}
                    disabled={(
                      (existingOwner === "yes" && !selectedPetId)
                      || (existingOwner === "no" && (
                        !intakeData.owner.first_name
                        || !intakeData.owner.last_name
                        || !intakeData.owner.email
                        || !intakeData.pet.name
                        || !intakeData.pet.species
                        || !intakeData.pet.breed
                        || !intakeData.pet.gender
                      ))
                      || !serviceType
                      || !selectedTime
                    )}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  </div>
  );
}
