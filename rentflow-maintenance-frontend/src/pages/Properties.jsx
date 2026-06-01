import React, { useEffect, useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useAuth } from "../context/AuthContext";

const fallbackProperties = [
  {
    title: "Sunset Apartments",
    location: "123 Main St, Springfield",
    units: 50,
    activeRequests: 0,
  },
  {
    title: "Lakeside Villas",
    location: "456 Lakeview Dr, Springfield",
    units: 30,
    activeRequests: 0,
  },
  {
    title: "Downtown Lofts",
    location: "789 Market St, Springfield",
    units: 20,
    activeRequests: 0,
  },
];

const Properties = () => {
  const { axiosWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosWithAuth.get("/requests");
        setRequests(res.data);
      } catch (err) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [axiosWithAuth]);

  const properties = useMemo(() => {
    if (!requests.length) return fallbackProperties;

    const grouped = requests.reduce((acc, request) => {
      const key = request.property;
      if (!acc[key]) {
        acc[key] = {
          title: key,
          location: "Managed property",
          units: "—",
          activeRequests: 0,
        };
      }
      if (request.status !== "resolved") acc[key].activeRequests += 1;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [requests]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Properties</h1>
        <p className="mt-1 text-sm text-slate-500">
          Properties are summarized from maintenance activity.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {properties.map((property) => (
          <PropertyCard
            key={property.title}
            title={property.title}
            location={property.location}
            units={loading ? "..." : property.units}
            activeRequests={loading ? "..." : property.activeRequests}
          />
        ))}
      </div>
    </div>
  );
};

export default Properties;
