import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="wrapper">
        <div className="auth-brand">
          <Link to="/">
            <img
              className="logo"
              src="https://res.cloudinary.com/ayorinde-timilehin/image/upload/v1624458327/Urbanc3tre_logo_uv65cf.jpg"
              alt="Urbanc3tre Brand Logo"
            />
          </Link>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
