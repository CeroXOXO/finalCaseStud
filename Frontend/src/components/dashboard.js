import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const projectsResponse = await axios.get(
          "http://localhost:8000/api/projects?limit=5",
          { headers }
        );
        setProjects(projectsResponse.data.projects);

        const tasksResponse = await axios.get(
          "http://localhost:8000/api/tasks?assigned_to_me=1&limit=5",
          { headers }
        );
        setTasks(tasksResponse.data.tasks);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading dashboard...</div>
        </div>
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar is in the nav component */}
        {/* Main content: offset by 2 cols on lg and up */}
        <div className="col-12 col-lg-10 offset-lg-2 py-4">
          <h1 className="mb-4">Project Management System</h1>

          {/* Menu */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Menu</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/projects/create" className="btn btn-outline-primary">
                      New Project
                    </Link>
                    <Link to="/projects" className="btn btn-outline-info">
                      Manage Projects
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Projects & My Tasks */}
          <div className="row mb-4">
            <div className="col-12 col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Projects</h5>
                  <Link to="/projects" className="btn btn-primary btn-sm">
                    View All Projects
                  </Link>
                </div>
                <div className="card-body">
                  {projects.length === 0 ? (
                    <p>No projects found.</p>
                  ) : (
                    <div className="list-group">
                      {projects.map((project) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <h6 className="mb-1">{project.name}</h6>
                            <small>
                              {project.description
                                ? `${project.description.substring(0, 50)}...`
                                : "No description"}
                            </small>
                          </div>
                          <span className={`badge bg-${getStatusBadge(project.status)}`}>
                            {project.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">My Tasks</h5>
                  <Link to="/tasks" className="btn btn-primary btn-sm">
                    View All Tasks
                  </Link>
                </div>
                <div className="card-body">
                  {tasks.length === 0 ? (
                    <p>No tasks assigned to you.</p>
                  ) : (
                    <div className="list-group">
                      {tasks.map((task) => (
                        <Link
                          key={task.id}
                          to={`/tasks/${task.id}`}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <h6 className="mb-1">{task.title}</h6>
                            <small>
                              Project:{" "}
                              {task.project?.name || `Project #${task.project_id}`}
                            </small>
                          </div>
                          <div className="d-flex flex-column align-items-end">
                            <span className={`badge bg-${getStatusBadge(task.status)}`}>
                              {task.status.replace("_", " ")}
                            </span>
                            <small className="mt-1">
                              Due:{" "}
                              {task.due_time
                                ? new Date(task.due_time).toLocaleDateString()
                                : "Not set"}
                            </small>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  switch (status) {
    case "planning":
    case "todo":
      return "secondary";
    case "active":
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "on_hold":
      return "warning";
    case "review":
      return "info";
    default:
      return "light";
  }
};

export default Dashboard;
