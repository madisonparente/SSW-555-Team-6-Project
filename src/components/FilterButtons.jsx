import React from "react";

const FilterButtons = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { key: "all", label: "All Events" },
    { key: "class", label: "Classes" },
    { key: "tutoring", label: "Tutoring" },
    { key: "deadline", label: "Deadlines" },
    { key: "office-hours", label: "Office Hours" }
  ];

  return (
    <div className="filter-buttons">
      {filters.map(filter => (
        <button
          key={filter.key}
          className={`filter-btn ${selectedFilter === filter.key ? "active" : ""}`}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;