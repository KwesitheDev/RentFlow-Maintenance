import React, { useEffect, useMemo, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import { Wrench, CircleAlert, Clock4, CircleCheckBig } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const cards = [
  { key: "totalRequests", title: "Total Requests", icon: Wrench, color: "blue" },
  { key: "pending", title: "Pending", icon: CircleAlert, color: "gray" },
  { key: "inProgress", title: "In Progress", icon: Clock4, color: "yellow" },
  { key: "resolved", title: "Resolved", icon: CircleCheckBig, color: "green" },
];

const emptyStats = {
  totalRequests: 0,
  pending: 0,
  inProgress: 0,
  resolved: 0,
};

const Home = () => {
  const { axiosWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosWithAuth.get("/requests");
        setRequests(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [axiosWithAuth]);

  const stats = useMemo(
    () =>
      requests.reduce(
        (acc, request) => {
          acc.totalRequests += 1;
          if (acc[request.status] !== undefined) acc[request.status] += 1;
          return acc;
        },
        { ...emptyStats },
      ),
    [requests],
  );

  const recentRequests = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live maintenance overview across your managed properties.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard
            key={card.key}
            title={card.title}
            icon={card.icon}
            value={loading ? "..." : stats[card.key]}
            color={card.color}
          />
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">Recent requests</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentRequests.length === 0 && (
            <p className="px-5 py-8 text-sm text-slate-500">
              {loading ? "Loading requests..." : "No requests have been created yet."}
            </p>
          )}
          {recentRequests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {request.issueDescription}
                </p>
                <p className="text-sm text-slate-500">
                  {request.tenantName} at {request.property}
                </p>
              </div>
              <span className="w-fit rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
                {request.status === "inProgress" ? "In progress" : request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
