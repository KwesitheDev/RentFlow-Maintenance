import React, { useState } from "react";
import DashboardCard from "../components/DashboardCard";
import { Wrench, CircleAlert, Clock4, CircleCheckBig } from "lucide-react";

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState({
    totalRequests: 10,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // Card Data
  const mockCardData = [
    {
      title: "Total Requests",
      icon: Wrench,
      value: value.totalRequests,
      color: "blue",
    },
    {
      title: "Pending",
      icon: CircleAlert,
      value: value.pending,
      color: "gray",
    },
    {
      title: "In Progress",
      icon: Clock4,
      value: value.inProgress,
      color: "yellow",
    },
    {
      title: "Resolved",
      icon: CircleCheckBig,
      value: value.resolved,
      color: "green",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mockCardData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            icon={card.icon}
            value={card.value}
            color={card.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
