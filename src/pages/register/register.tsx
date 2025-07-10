import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getUserThunk, registerUserThunk } from '../../slices/userSlice';
import { Preloader } from '@ui';
import { setCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.user.isLoading);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      return setErrorText('все поля обязательны для заполнения');
    }
    try {
      const response = await dispatch(
        registerUserThunk({
          email: email,
          name: userName,
          password: password
        })
      ).unwrap();
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      await dispatch(getUserThunk());
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setErrorText(err.message);
      } else {
        setErrorText('ошибка');
      }
    }
  };

  return isLoading ? (
    <Preloader />
  ) : (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
