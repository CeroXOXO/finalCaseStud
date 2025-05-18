import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(data.projects);
      } catch {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            style={{ width: '3rem', height: '3rem' }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Fetching Projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar (col-2) lives in Navigation component */}
        <div className="col-12 col-lg-10 offset-lg-2 py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Projects</h2>
            <Link to="/projects/create" className="btn btn-primary">
              Create New Project
            </Link>
          </div>

          {projects.length === 0 ? (
            <p>No projects found. Create a new project to get started.</p>
          ) : (
            <div className="row">
              {projects.map(project => (
                <div key={project.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text flex-grow-1">
                        {project.description || 'No description.'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className={`badge bg-${getStatusBadge(project.status)}`}>
                          {project.status}
                        </span>
                        <small>
                          Due: {project.due_date
                            ? new Date(project.due_date).toLocaleDateString()
                            : 'N/A'}
                        </small>
                      </div>
                      <div className="mt-auto">
                        <Link to={`/projects/${project.id}`} className="btn btn-info btn-sm me-2">
                          View
                        </Link>
                        <Link to={`/projects/${project.id}/edit`} className="btn btn-warning btn-sm">
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'planning':   return 'secondary';
    case 'active':     return 'primary';
    case 'completed':  return 'success';
    case 'on_hold':    return 'warning';
    default:           return 'info';
  }
};

export default ProjectList;
