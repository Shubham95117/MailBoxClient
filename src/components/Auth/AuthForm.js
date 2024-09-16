import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, loginUser } from "../../store/auth/authSlice";
import "./AuthForm.css"; // Import the CSS file

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure passwords match when signing up
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Dispatch signup or login action
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(signupUser({ email, password }));
    }
  };

  const switchAuthMode = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {/* Show error message at the top if it exists */}
        {error && <p className="error-message">{error}</p>}

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm password only for signup */}
        {!isLogin && (
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? isLogin
              ? "Logging in..."
              : "Signing up..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </button>

        {/* Success message */}
        {user && (
          <p className="success-message">Success! Welcome, {user.email}</p>
        )}

        <div className="switch-mode">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button type="button" onClick={switchAuthMode}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
