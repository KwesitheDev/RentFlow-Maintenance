import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Wrench } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import RequestsView from "./pages/RequestsView";
import UsersView from "./pages/UsersView";
import Properties from "./pages/Properties";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Wrench className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/app/home" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/app/home" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="requests" element={<RequestsView />} />
            <Route path="properties" element={<Properties />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <UsersView />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/home" element={<Navigate to="/app/home" replace />} />
          <Route
            path="/requests"
            element={<Navigate to="/app/requests" replace />}
          />
          <Route
            path="/properties"
            element={<Navigate to="/app/properties" replace />}
          />
          <Route
            path="/settings"
            element={<Navigate to="/app/settings" replace />}
          />
          <Route path="/users" element={<Navigate to="/app/users" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
