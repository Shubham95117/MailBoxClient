import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmailPage.css"; // Import the CSS file

const EmailPage = () => {
  const navigate = useNavigate();

  const handleComposeClick = () => {
    navigate("/compose"); // Navigate to the Compose page
  };

  return (
    <div className="email-page">
      <h1>Email Page</h1>
      <button className="compose-button" onClick={handleComposeClick}>
        Compose Email
      </button>
    </div>
  );
};

export default EmailPage;
