import "./UpcomingEvents.css";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);

const FILTER_KEYS = ["date", "time", "serviceType", "petName", "petOwner", "status"];

const FILTER_CONFIG = [
  { key: "date", label: "DATE", title: "Filter by Date" },
  { key: "time", label: "TIME", title: "Filter by Time" },
  { key: "serviceType", label: "SERVICE TYPE", title: "Filter by Service Type" },
  { key: "petName", label: "PET NAME", title: "Filter by Pet Name" },
  { key: "petOwner", label: "PET OWNER", title: "Filter by Pet Owner" },
  { key: "status", label: "STATUS", title: "Filter by Status" },
];

function getStatusClass(status) {
  const normalized = (status || "").toUpperCase();
  if (normalized === "CONFIRMED") {
    return "status-pill status-confirmed";
  }
  if (normalized === "CANCELLED") {
    return "status-pill status-cancelled";
  }
  return "status-pill";
}

function ColumnFilterDropdown({
  title,
  options,
  selectedOptions,
  onToggleOption,
  onSelectAll,
  onClear,
  onClose,
}) {
  return (
    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="filter-dropdown-header">
        <span>{title}</span>
        <button type="button" className="filter-icon-btn" onClick={onClose}>
          x
        </button>
      </div>

      <div className="filter-dropdown-actions">
        <button type="button" className="filter-action-link" onClick={onSelectAll}>
          Select All
        </button>
        <span className="filter-action-sep">•</span>
        <button type="button" className="filter-action-link" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="filter-options">
        {options.map((option) => (
          <label key={option} className="filter-option-row">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => onToggleOption(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className="filter-dropdown-footer">
        {selectedOptions.length} of {options.length} selected
      </div>
    </div>
  );
}

export default function UpcomingEvents({ upcomingEvents = [] }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const prevFilterOptionsRef = useRef({});
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({});

  const normalizedRows = useMemo(
    () =>
      upcomingEvents.map((event) => ({
        raw: event,
        date: event.date_time ? dayjs.utc(event.date_time).format("DD/MM/YY") : "-",
        time: event.date_time ? dayjs.utc(event.date_time).format("HH:mm") : "-",
        serviceType: event.service_type || "-",
        petName: event.pet_name || "-",
        petOwner: event.pet_owner_name || "-",
        status: event.status || "-",
      })),
    [upcomingEvents],
  );

  const filterOptions = useMemo(() => {
    const makeUnique = (values) => [...new Set(values)];
    return {
      date: makeUnique(normalizedRows.map((row) => row.date)),
      time: makeUnique(normalizedRows.map((row) => row.time)).sort(),
      serviceType: makeUnique(normalizedRows.map((row) => row.serviceType)),
      petName: makeUnique(normalizedRows.map((row) => row.petName)),
      petOwner: makeUnique(normalizedRows.map((row) => row.petOwner)),
      status: makeUnique(normalizedRows.map((row) => row.status)),
    };
  }, [normalizedRows]);

  useEffect(() => {
    setFilters((prev) => {
      const next = { ...prev };

      FILTER_KEYS.forEach((key) => {
        const currentValues = prev[key];
        const availableValues = filterOptions[key] || [];
        const previousAvailableValues = prevFilterOptionsRef.current[key] || [];

        if (!currentValues || currentValues.length === 0) {
          next[key] = [...availableValues];
          return;
        }

        const hadAllSelectedPreviously =
          previousAvailableValues.length > 0
          && currentValues.length === previousAvailableValues.length
          && previousAvailableValues.every((value) => currentValues.includes(value));

        // Preserve "Select All" behavior when new options appear (e.g. new appointment date/time).
        if (hadAllSelectedPreviously) {
          next[key] = [...availableValues];
          return;
        }

        next[key] = currentValues.filter((value) => availableValues.includes(value));
      });

      return next;
    });

    prevFilterOptionsRef.current = FILTER_KEYS.reduce((acc, key) => {
      acc[key] = [...(filterOptions[key] || [])];
      return acc;
    }, {});
  }, [filterOptions]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const filteredRows = useMemo(
    () =>
      normalizedRows.filter((row) =>
        FILTER_KEYS.every((key) => (filters[key] || []).includes(row[key])),
      ),
    [filters, normalizedRows],
  );

  const toggleFilterOption = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const selectAllFilterOptions = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: [...(filterOptions[key] || [])],
    }));
  };

  const clearFilterOptions = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: [],
    }));
  };

  const isColumnFiltered = (key) => {
    const selectedOptions = filters[key] || [];
    const availableOptions = filterOptions[key] || [];

    return availableOptions.length > 0 && selectedOptions.length !== availableOptions.length;
  };

  return (
    <section ref={containerRef}>
      <div className="panel events">
        <div className="upcoming-appointments-banner">
          <p>Upcoming Appointments</p>
        </div>

        <div className="events-header-row">
          {FILTER_CONFIG.map((config) => (
            <div key={config.key} className="events-header-cell">
              <button
                type="button"
                className={`filter-trigger ${activeFilter === config.key ? "filter-trigger-active" : ""} ${isColumnFiltered(config.key) ? "filter-trigger-filtered" : ""}`}
                onClick={() =>
                  setActiveFilter((prev) => (prev === config.key ? null : config.key))
                }
              >
                <span>{config.label}</span>
                {isColumnFiltered(config.key) && (
                  <span className="filter-active-dot" aria-hidden="true" />
                )}
                <span className="filter-chevron" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {activeFilter === config.key && (
                <ColumnFilterDropdown
                  title={config.title}
                  options={filterOptions[config.key] || []}
                  selectedOptions={filters[config.key] || []}
                  onToggleOption={(value) => toggleFilterOption(config.key, value)}
                  onSelectAll={() => selectAllFilterOptions(config.key)}
                  onClear={() => clearFilterOptions(config.key)}
                  onClose={() => setActiveFilter(null)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="events-list">
          {filteredRows.length === 0 ? (
            <div className="events-empty">No appointments match the selected filters.</div>
          ) : (
            filteredRows.map((row) => (
              <div key={row.raw.id} className="events-row">
                <div className="appt-date">{row.date}</div>
                <div className="appt-title">{row.time}</div>
                <div className="appt-title appt-service-cell">
                  <span>{row.serviceType}</span>
                  <span
                    className="edit-icon"
                    onClick={() =>
                      navigate("/provider/manage-appointments", {
                        state: { appointment: row.raw },
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3" />
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="appt-title">{row.petName}</div>
                <div className="appt-title">{row.petOwner}</div>
                <div className="appt-title">
                  <span className={getStatusClass(row.status)}>{row.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
