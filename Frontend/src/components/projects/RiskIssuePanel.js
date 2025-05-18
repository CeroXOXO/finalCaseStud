import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const RiskIssuePanel = ({ projectId, isOwner }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePopover, setActivePopover] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "issue",
    title: "",
    description: "",
    impact_level: "medium",
  });

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/api/projects/${projectId}/risks-issues`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(data);
    } catch {
      setError("Failed to load risks/issues.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (issue, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/risks-issues/${issue.id}`,
        { ...issue, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchIssues();
      setActivePopover(null);
    } catch {
      alert("Failed to update status");
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `/api/projects/${projectId}/risks-issues`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(i => [data, ...i]);
      setShowModal(false);
      setForm({ type: "issue", title: "", description: "", impact_level: "medium" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit.");
    }
  };

  const StatusPopover = ({ issue }) => {
    const ref = useRef();
    const next = issue.status === "closed" ? "open" : "closed";

    useEffect(() => {
      const onClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
          setActivePopover(null);
        }
      };
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }, []);

    return (
      <div
        ref={ref}
        className="position-absolute bg-light border rounded p-2 shadow"
        style={{ zIndex: 1000 }}
      >
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => handleChangeStatus(issue, next)}
        >
          Change to "{next}"
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading Risks/Issues…</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* sidebar in Navigation; content offset */}
        <div className="col-12 col-lg-10 offset-lg-2 py-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Project Risks &amp; Issues</h5>
              <button className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>
                Report
              </button>
            </div>
            <div className="card-body">
              {issues.length === 0 ? (
                <p>No risks or issues reported for this project.</p>
              ) : (
                <ul className="list-group">
                  {issues.map(issue => (
                    <li
                      key={issue.id}
                      className="list-group-item position-relative d-flex flex-column flex-md-row justify-content-between align-items-start"
                    >
                      <div className="me-3">
                        <strong>{issue.title}</strong>
                        <p className="mb-1 text-muted">{issue.description}</p>
                        <p className="mb-0">
                          <small className="text-muted">
                            <strong>Type:</strong> {issue.type} |{" "}
                            <strong>Impact:</strong> {issue.impact_level}
                          </small>
                        </p>
                      </div>
                      <div className="mt-2 mt-md-0 text-end">
                        <span
                          className={`badge bg-${issue.status === "open" ? "danger" : "success"}`}
                        >
                          {issue.status}
                        </span>
                        {(isOwner || issue.type === "issue") && (
                          <button
                            className="btn btn-sm btn-link ms-2"
                            onClick={() =>
                              setActivePopover(activePopover === issue.id ? null : issue.id)
                            }
                          >
                            Change Status
                          </button>
                        )}
                        {activePopover === issue.id && <StatusPopover issue={issue} />}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Modal for reporting */}
          {showModal && (
            <div className="modal show d-block" tabIndex="-1" onClick={() => setShowModal(false)}>
              <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Report Risk/Issue</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        name="type"
                        value={form.type}
                        onChange={handleInputChange}
                        disabled={!isOwner}
                      >
                        <option value="issue">Issue</option>
                        <option value="risk">Risk</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Impact Level</label>
                      <select
                        className="form-select"
                        name="impact_level"
                        value={form.impact_level}
                        onChange={handleInputChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskIssuePanel;
