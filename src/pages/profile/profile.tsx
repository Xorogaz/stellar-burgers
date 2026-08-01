import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react';

import { ProfileUI } from '@ui-pages';
import { TRegisterData } from '@api';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '@slices';
import { selectUser, selectUserError } from '@selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const updatedUserData: Partial<TRegisterData> = {};
    if (formValue.name !== user?.name) updatedUserData.name = formValue.name;
    if (formValue.email !== user?.email)
      updatedUserData.email = formValue.email;
    if (formValue.password) updatedUserData.password = formValue.password;

    dispatch(updateUser(updatedUserData)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue((prevState) => ({ ...prevState, password: '' }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
