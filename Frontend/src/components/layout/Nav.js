import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Bell, Menu, Settings as SettingsIcon, HelpCircle } from 'react-feather';
import axios from 'axios';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.length > notifications.length) setHasNew(true);
        setNotifications(data);
      } catch {
        console.error('Failed to fetch notifications.');
      }
    };

    fetchNotifications();
    const iv = setInterval(fetchNotifications, 5000);
    return () => clearInterval(iv);
  }, [notifications.length]);

  const toggleModal = () => {
    setShowModal((m) => !m);
    setHasNew(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-12 col-lg-2 bg-primary text-white p-3 position-fixed vh-100 d-flex flex-column" id="sidebar">
          <div>
            <h5 className="fw-bold">Klick Inc.</h5>
            <div className="mb-4">Hi, <strong>{user?.name}</strong></div>
          </div>

          <ul className="nav flex-column mb-4">
            <li className="nav-item mb-2">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active text-white bg-white bg-opacity-25 rounded' : 'text-white'}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/projects"
                className={`nav-link ${location.pathname.startsWith('/projects') ? 'active text-white bg-white bg-opacity-25 rounded' : 'text-white'}`}
              >
                Project Management
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/support"
                className={`nav-link ${location.pathname === '/support' ? 'active text-white bg-white bg-opacity-25 rounded' : 'text-white'}`}
              >
         
                Support
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/settings"
                className={`nav-link ${location.pathname === '/settings' ? 'active text-white bg-white bg-opacity-25 rounded' : 'text-white'}`}
              >
   
                Settings
              </Link>
            </li>
          </ul>

          <div className="mt-auto">
            <button
              className="btn btn-outline-light w-100 mb-2 d-flex align-items-center justify-content-center"
              onClick={toggleModal}
            >
              <Bell />
              {hasNew && <span className="badge bg-danger ms-2">!</span>}
              <span className="ms-2">Activity</span>
            </button>

            <button className="btn btn-light w-100" onClick={onLogout}>
              Logout
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div className="col-12 col-lg-10 offset-lg-2 p-3">
          <button
            className="btn btn-primary mb-3 d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebar"
            aria-controls="sidebar"
          >
            <Menu />
          </button>

          <Outlet />
        </div>
      </div>

      {/* Notification Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" onClick={toggleModal}>
          <div className="modal-dialog modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Recent Activity</h5>
                <button type="button" className="btn-close btn-close-white" onClick={toggleModal} />
              </div>
              <div className="modal-body">
                {notifications.length === 0 ? (
                  <p>No recent activity.</p>
                ) : (
                  <ul className="list-group">
                    {notifications.map((act) => (
                      <li key={act.id} className="list-group-item">
                        <strong>{act.user?.name || 'Unknown'}</strong>: {act.description}
                        <br />
                        <small className="text-muted">
                          {new Date(act.created_at).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
