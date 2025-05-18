import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const AddExpenditure = () => {
  const { id } = useParams(); // project ID
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/projects/${id}/expenditures`,
        { amount, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/projects/${id}/expenditures`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to add expenditure. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar lives in Navigation; this content sits beside it */}
        <div className="col-12 col-lg-10 offset-lg-2 py-4">
          <h3 className="mb-4">Record New Expenditure</h3>

          <Link to={`/projects/${id}/expenditures`} className="btn btn-secondary mb-3">
            Back to Expenditures
          </Link>

          {error && <div className="alert alert-danger">{error}</div>}

          <form
            onSubmit={handleSubmit}
            className="card p-4 shadow-sm"
          >
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount (₱)
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? "Recording..." : "Record Expenditure"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpenditure;
