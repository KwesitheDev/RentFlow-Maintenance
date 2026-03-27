import React from "react";
import { Building2, MapPin } from "lucide-react";
import Card from "./Card";

const PropertyCard = ({ title, location, units, activeRequests }) => {
  return (
    <Card className="shadow-lg border-none">
      {/* Title of proper */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={20} />
          </div>

          <h3 className="text-xl font-medium ">{title}</h3>
        </div>

        {/* {Location of property} */}
        <div>
          <p className="text-sm text-slate-500 flex  space-x-1">
            <MapPin size={16} /> {location}
          </p>
        </div>
      </div>
      <br />
      <hr />

      <div className="mt-6 flex space-x-6 justify-between">
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-slate-900">{units}</p>
          <p className="text-sm text-slate-500">Units</p>
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-semibold text-blue-600">
            {activeRequests}
          </p>
          <p className="text-sm text-slate-500">Active Requests</p>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
