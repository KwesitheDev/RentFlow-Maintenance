import React, { useState } from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import { User, Shield, Bell } from "lucide-react";

const Settings = () => {
  const { user, axiosWithAuth } = useAuth();
  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [updating, setUpdating] = useState(false);

  //   Handle profile update

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);

      await axiosWithAuth.put(`/users/${user._id}`, {
        name: username,
        email: email,
      });

      alert("Profile updated successfully");

      //refetch user
      window.location.reload();
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* User Information Card */}

      <Card className="flex flex-col gap-4 p-6 mb-6 shadow-lg">
        <div className="flex gap-2 items-center">
          <User size={20} />
          <span className="font-semibold text-lg">Profile Information</span>
        </div>
        <Input
          type="text"
          label="Full Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></Input>
        <Input
          type="text"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <div className="flex justify-start">
          <button
            className="btn btn-primary inline-flex px-4 py-2"
            onClick={handleProfileUpdate}
            disabled={updating}
          >
            <span className="text-white">Update Profile</span>
          </button>
        </div>
      </Card>

      {/* Change Password Card*/}
      <Card className="mb-6 p-6 shadow-lg">
        <div className="flex  gap-2 items-center">
          <Shield size={20} />
          <span className="font-semibold text-lg">Account & Security</span>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-2">Role</p>
          {/* Conditional rendering based on role */}
          <span
            className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
              user?.role === "admin"
                ? "bg-purple-100 text-purple-800 border border-purple-200"
                : "bg-blue-100 border-blue-200 text-blue-800 border"
            }`}
          >
            {user?.role === "admin" ? "Admin" : "Manager"}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-2">Role</p>
          {/* Conditional rendering based on role */}
          <span
            className={`inline-block  text-sm font-medium text-blue-600 cursor-pointer`}
          >
            Change Password{" "}
          </span>
        </div>
      </Card>

      {/* Notification Card */}
      <Card className="mb-6 p-6 shadow-lg">
        <div className="flex  gap-2 items-center">
          <Bell size={20} />
          <span className="font-semibold text-lg">Notifications</span>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-2">
            Email Notifications
          </p>
          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm text-gray-700">Receive email updates</span>
          </label>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-2">
            Push Notifications
          </p>
          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm text-gray-700">
              Receive push notifications for urgent requests
            </span>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
