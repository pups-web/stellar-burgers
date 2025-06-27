import { ReactElement } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Preloader } from '../../components/ui';
import {
  getUser,
  getUserisInit,
  getUserLoading
} from '../../services/chooseOnes';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children?: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const user = useSelector(getUser);
  const isInit = useSelector(getUserisInit);
  const isLoading = useSelector(getUserLoading);
  const location = useLocation();

  if (!isInit || isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/profile' replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
};
