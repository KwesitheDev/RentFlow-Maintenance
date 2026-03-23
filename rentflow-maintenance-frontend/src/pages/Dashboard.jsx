import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import RequestsView from "../components/RequestsView";
import UsersView from "../components/UsersView";
import { useAuth } from "../context/AuthContext";
import Home from "./Home";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <RequestsView />;
      case "users":
        return user?.role === "admin" ? <UsersView /> : null;
      case "home":
        return <Home />;
      default:
        return <Home />;
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
