import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import RequestsView from "./RequestsView";
import UsersView from "./UsersView";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <RequestsView />;
      case "users":
        return user?.role === "admin" ? <UsersView /> : null;
      default:
        return <RequestsView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={user?.role}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
