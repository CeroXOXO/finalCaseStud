import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    due_date: "",
    status: "planning",
    budget: "",
  });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;

    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data: { project } } = await axios.get(
          `http://localhost:8000/api/projects/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormData({
          name: project.name,
          description: project.description || "",
          start_date: project.start_date?.split("T")[0] || "",
          due_date: project.due_date?.split("T")[0] || "",
          status: project.status,
          budget: project.budget || "",
        });
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `http://localhost:8000/api/projects/${id}`
        : "http://localhost:8000/api/projects";
      const method = isEditing ? "put" : "post";

      await axios({ method, url, data: formData,
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/projects");
    } catch (err) {
      const msg = err.response?.data?.message
        || "You don’t have permission to perform this action.";
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading form…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* sidebar is rendered in Navigation; here we offset content */}
        <div className="col-12 col-lg-10 offset-lg-2 py-4">
          <h2 className="mb-4">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Project Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label htmlFor="start_date" className="form-label">Start Date</label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="form-control"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="due_date" className="form-label">Due Date</label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  className="form-control"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                className="form-select"
                required
                value={formData.status}
                onChange={handleChange}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="budget" className="form-label">Budget (₱)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                className="form-control"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button type="submit" className="btn btn-primary">
                {isEditing ? "Update Project" : "Create Project"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
