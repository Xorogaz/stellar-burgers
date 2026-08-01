import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearUserError, loginUser } from '@slices';
import { selectUserError } from '@selectors';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const userError = useSelector(selectUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(
    () => () => {
      dispatch(clearUserError());
    },
    [dispatch]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={userError ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
