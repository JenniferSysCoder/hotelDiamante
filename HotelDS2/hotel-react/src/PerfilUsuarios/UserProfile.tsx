import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg rounded-4" style={{ width: '22rem' }}>
        <div className="card-body text-center">
          <h5 className="card-title text-warning fs-4">User Profile</h5>
          <div className="my-3">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="User Avatar"
              className="rounded-circle border border-warning"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </div>
          <h5 className="fw-bold text-danger">ADMINISTRADOR</h5>
          <div className="mt-4 p-3 border rounded bg-white text-start">
            <p className="mb-2">
              <strong>Name:</strong> Juan Pérez
            </p>
            <p className="mb-2">
              <strong>Email:</strong>{' '}
              <span className="text-warning">admin.@gmail.com</span>
            </p>
            <p className="mb-0">
              <strong>Phone:</strong>{' '}
              <span className="text-warning">+503 1234-5678</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
