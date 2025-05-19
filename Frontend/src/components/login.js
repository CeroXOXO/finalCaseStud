import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Server error");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(to right, #0d47a1, #1976d2)",
      }}
    >
      <div
        className="bg-white shadow-lg rounded-4 p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Klick Inc.</h2>

        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="btn btn-link text-primary p-0"
              onClick={() => alert("Coming soon")}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-3 mb-3">
            Login
          </button>

          <div className="text-center text-muted mb-2">or</div>

          <button
            type="button"
            className="btn btn-outline-primary w-100 rounded-3"
            onClick={() => navigate("/register")}
          >
            Create New Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
