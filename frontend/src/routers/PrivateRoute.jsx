// import React from 'react'
import PropTypes from 'prop-types';
import useAuth from './../context/useAuth';
import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentUser) {
    return children;
  } return <Navigate to = "/login" replace />;
}
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute
