import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import RequestsView from "./pages/RequestsView";
import UsersView from "./pages/UsersView";
import Properties from "./pages/Properties";

import { Wrench } from "lucide-react";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Wrench className="animate-spin h-8 w-8 text-indigo-500" />
      </div>
    );

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="requests" element={<RequestsView />} />
            <Route path="properties" element={<Properties />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<UsersView />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
