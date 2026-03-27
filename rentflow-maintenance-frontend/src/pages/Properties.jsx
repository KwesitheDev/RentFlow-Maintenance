import React from "react";
import PropertyCard from "../components/PropertyCard";

const Properties = () => {
  const dummyProperties = [
    {
      id: 1,
      title: "Sunset Apartments",
      location: "123 Main St, Springfield",
      units: 50,
      activeRequests: 5,
    },
    {
      id: 2,
      title: "Lakeside Villas",
      location: "456 Lakeview Dr, Springfield",
      units: 30,
      activeRequests: 2,
    },
    {
      id: 3,
      title: "Downtown Lofts",
      location: "789 Market St, Springfield",
      units: 20,
      activeRequests: 8,
    },
  ];
  return (
    <div>
      <h1>Properties</h1>
      <div className="grid grid-cols-1 gap-4">
        {dummyProperties.map((property) => (
          <PropertyCard
            key={property.id}
            title={property.title}
            location={property.location}
            units={property.units}
            activeRequests={property.activeRequests}
          />
        ))}
      </div>
    </div>
  );
};

export default Properties;
