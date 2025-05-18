import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57"];

const ProjectReport = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [projRes, tasksRes, expRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/projects/${id}`, { headers }),
          axios.get(`http://localhost:8000/api/projects/${id}/tasks`, { headers }),
          axios.get(`http://localhost:8000/api/projects/${id}/expenditures`, { headers }),
        ]);

        setProject(projRes.data.project);
        setTasks(tasksRes.data.tasks);
        setExpenditures(expRes.data);
      } catch {
        setError("Failed to load report data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const totalCost = expenditures.reduce((sum, e) => sum + Number(e.amount), 0);
  const completion = tasks.length
    ? Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)
    : 0;

  const chartData = expenditures.reduce((acc, e) => {
    const found = acc.find(item => item.name === e.description);
    if (found) found.value += Number(e.amount);
    else acc.push({ name: e.description, value: Number(e.amount) });
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <div>Loading report...</div>
        </div>
      </div>
    );
  }
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar sits in Navigation; content offset by 2 cols on lg+ */}
        <div className="col-12 col-lg-10 offset-lg-2 py-4">
          <h2 className="mb-3">Project Report: {project.name}</h2>
          <p className="text-muted">{project.description}</p>

          <div className="row mb-4">
            <div className="col-12 col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header">Progress</div>
                <div className="card-body">
                  <p><strong>Total Tasks:</strong> {tasks.length}</p>
                  <p><strong>Completed:</strong> {tasks.filter(t => t.status === "completed").length}</p>
                  <p><strong>Progress:</strong></p>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${completion}%` }}
                      aria-valuenow={completion}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {completion}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header">Budget</div>
                <div className="card-body">
                  <p><strong>Budget:</strong> ₱{Number(project.budget || 0).toFixed(2)}</p>
                  <p><strong>Actual Cost:</strong> ₱{totalCost.toFixed(2)}</p>
                  <p><strong>Remaining Budget:</strong> ₱{(project.budget - totalCost).toFixed(2)}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {totalCost > project.budget
                      ? <span className="text-danger">Over Budget</span>
                      : <span className="text-success">Within Budget</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">Expenditure Breakdown</div>
            <div className="card-body">
              {chartData.length === 0
                ? <p>No expenditures to display.</p>
                : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">Detailed Expenditures</div>
            <div className="card-body table-responsive">
              <table className="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenditures.map((e, idx) => (
                    <tr key={e.id}>
                      <td>{idx + 1}</td>
                      <td>{e.description}</td>
                      <td>₱{Number(e.amount).toFixed(2)}</td>
                      <td>{new Date(e.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Link to={`/projects/${id}`} className="btn btn-outline-secondary">
            Back to Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectReport;
