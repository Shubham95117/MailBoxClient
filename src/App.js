import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import EmailPage from "./components/Mail/EmailPage";
import CreateEmail from "./components/Mail/CreateMail"; // Import CreateEmail component
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect to Email Page if authenticated */}
          <Route
            path="/"
            element={user ? <Navigate to="/email" /> : <AuthPage />}
          />
          {/* Protected route for Email Page */}
          <Route
            path="/email"
            element={user ? <EmailPage /> : <Navigate to="/" />}
          />
          {/* Route for Compose Email Page */}
          <Route
            path="/compose"
            element={user ? <CreateEmail /> : <Navigate to="/" />}
          />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
