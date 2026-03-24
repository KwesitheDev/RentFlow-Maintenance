import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function RequestsView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  //  Dummy Data
  useEffect(() => {
    const dummyData = [
      {
        _id: "1",
        tenantName: "Sarah Johnson",
        property: "Oak Street Apartments - A-204",
        issueDescription: "Kitchen sink leaking",
        priority: "high",
        status: "inProgress",
        assignedTo: "Mike Rodriguez",
        createdAt: "2026-03-15",
      },
      {
        _id: "2",
        tenantName: "David Chen",
        property: "Maple Heights - B-102",
        issueDescription: "AC not cooling properly",
        priority: "high",
        status: "pending",
        assignedTo: "",
        createdAt: "2026-03-16",
      },
      {
        _id: "3",
        tenantName: "Emily Rodriguez",
        property: "Pine View Condos - C-301",
        issueDescription: "Light fixture flickering",
        priority: "medium",
        status: "pending",
        assignedTo: "",
        createdAt: "2026-03-14",
      },
      {
        _id: "4",
        tenantName: "Michael Brown",
        property: "Oak Street Apartments - A-105",
        issueDescription: "Window won't close properly",
        priority: "medium",
        status: "inProgress",
        assignedTo: "James Wilson",
        createdAt: "2026-03-13",
      },
      {
        _id: "5",
        tenantName: "Jessica Martinez",
        property: "Maple Heights - B-205",
        issueDescription: "Smoke detector beeping",
        priority: "medium",
        status: "resolved",
        assignedTo: "Mike Rodriguez",
        createdAt: "2026-03-12",
      },
      {
        _id: "6",
        tenantName: "Robert Taylor",
        property: "Pine View Condos - C-102",
        issueDescription: "Carpet stain removal needed",
        priority: "low",
        status: "resolved",
        assignedTo: "Cleaning Crew",
        createdAt: "2026-03-10",
      },
      {
        _id: "7",
        tenantName: "Amanda White",
        property: "Oak Street Apartments - A-310",
        issueDescription: "Dishwasher not draining",
        priority: "medium",
        status: "pending",
        assignedTo: "",
        createdAt: "2026-03-17",
      },
      {
        _id: "8",
        tenantName: "Christopher Lee",
        property: "Maple Heights - B-401",
        issueDescription: "Door lock sticking",
        priority: "high",
        status: "pending",
        assignedTo: "",
        createdAt: "2026-03-18",
      },
    ];

    setRequests(dummyData);
    setLoading(false);
  }, []);

  //  Ranking logic
  const priorityRank = { high: 3, medium: 2, low: 1 };
  const statusRank = { pending: 3, inProgress: 2, resolved: 1 };

  //  Sorting
  const sortedRequests = [...requests].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === "priority") {
      aVal = priorityRank[aVal];
      bVal = priorityRank[bVal];
    }

    if (sortConfig.key === "status") {
      aVal = statusRank[aVal];
      bVal = statusRank[bVal];
    }

    if (sortConfig.key === "createdAt") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  //  UI helpers
  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800 border border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      low: "bg-green-100 text-green-800 border border-green-200 ",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${styles[priority]}`}
      >
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-gray-100 text-gray-800 border border-gray-200",
      inProgress: "bg-blue-100 text-blue-800 border border-blue-200",
      resolved: "bg-green-100 text-green-800 border border-green-200",
    };

    const labels = {
      pending: "Pending",
      inProgress: "In Progress",
      resolved: "Resolved",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Maintenance Requests</h2>

        <button className="btn btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-gray-500 uppercase text-xs font-medium tracking-wider">
              <th className="px-6 py-3 text-left">Tenant</th>

              <th
                onClick={() => handleSort("property")}
                className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Property{" "}
                  <span className="text-xs">{getArrow("property")}</span>
                </div>
              </th>

              <th className="px-6 py-3 text-left">Issue</th>

              <th
                onClick={() => handleSort("priority")}
                className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Priority{" "}
                  <span className="text-xs">{getArrow("priority")}</span>
                </div>
              </th>

              <th
                onClick={() => handleSort("status")}
                className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100"
              >
                <div>
                  Status <span className="text-xs">{getArrow("status")}</span>
                </div>{" "}
              </th>

              <th className="px-6 py-3 text-left">Assigned To</th>

              <th
                onClick={() => handleSort("createdAt")}
                className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100"
              >
                Date Created {getArrow("createdAt")}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedRequests.map((req) => (
              <tr
                key={req._id}
                className="border-t hover:bg-gray-50 text-sm text-wrap"
              >
                <td className="px-6 py-4  text-center">{req.tenantName}</td>

                <td className="px-6 py-4  text-center">{req.property}</td>

                <td className="px-6 py-4  text-center">
                  {req.issueDescription}
                </td>

                <td className="px-6 py-4 text-center">
                  {getPriorityBadge(req.priority)}
                </td>

                <td className=" text-center">{getStatusBadge(req.status)}</td>

                <td className="px-6 py-4  text-center">
                  {req.assignedTo || "—"}
                </td>

                <td className="px-6 py-4">
                  {new Date(req.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
