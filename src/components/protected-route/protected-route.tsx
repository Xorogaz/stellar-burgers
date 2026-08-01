import { FC } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectUser } from '@selectors';
import { TProtectedRouteProps } from './type';

type TFromLocationState = {
  from?: Location;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  component
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = (location.state as TFromLocationState) ?? {};
    return <Navigate replace to={from ?? '/'} />;
  }

  return component;
};
