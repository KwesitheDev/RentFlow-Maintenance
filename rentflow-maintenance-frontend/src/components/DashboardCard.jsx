import React from "react";
import Card from "./Card";

const DashboardCard = ({ title, icon: Icon, value, color = "blue" }) => {
  const colorVariants = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    green: "bg-green-50 text-green-600 border-green-200",
  };
  return (
    <Card>
      <div className="flex justify-between items-center ">
        <div className="flex flex-col justify-between h-20">
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        {Icon && (
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg  ${colorVariants[color]}`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;
