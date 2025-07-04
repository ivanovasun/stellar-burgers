import React, { useEffect, FC } from 'react';
import { useSelector } from '../../services/store';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

interface ProtectedRouteState {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteState> = ({
  onlyUnAuth = false,
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user.user);
  const userIsLoading = useSelector((state) => state.user.isLoading);
  useEffect(() => {
    if (userIsLoading) return;

    if (!onlyUnAuth && !userData) {
      navigate('/login', { state: { from: location }, replace: true });
    } else if (onlyUnAuth && userData) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [userIsLoading, userData, navigate, location, onlyUnAuth]);

  if (userIsLoading) {
    return <Preloader />;
  }

  if ((onlyUnAuth && !userData) || (!onlyUnAuth && userData)) {
    return children;
  }

  return null;
};
