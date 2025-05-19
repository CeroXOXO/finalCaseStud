import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("team_member");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setPasswordStrength("weak");
    } else if (
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /[0-9]/.test(newPassword)
    ) {
      setPasswordError("");
      setPasswordStrength("strong");
    } else {
      setPasswordError("");
      setPasswordStrength("medium");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#0074cc", // blue background
      }}
    >
      <div
        className="p-4 rounded-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#0074cc" }}>
          SIGN UP
        </h3>

        {error && (
          <div className="alert alert-danger text-center py-1">{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label className="form-label visually-hidden">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control border-0 border-bottom"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label visually-hidden">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control border-0 border-bottom"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label visually-hidden">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control border-0 border-bottom"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            {passwordStrength && (
              <small className="text-muted">Strength: {passwordStrength}</small>
            )}
            {passwordError && (
              <small className="text-danger d-block">{passwordError}</small>
            )}
          </div>

          <div className="form-group mb-4">
            <label className="form-label visually-hidden">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control border-0 border-bottom"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill fw-bold"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-link text-decoration-none text-primary"
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
