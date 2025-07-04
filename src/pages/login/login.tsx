import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getUserThunk, loginUserThunk } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return setErrorText('все поля обязательны для заполнения');
    }
    try {
      const response = await dispatch(
        loginUserThunk({
          email: email,
          password: password
        })
      ).unwrap();
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      await dispatch(getUserThunk());
      navigate('/', {
        replace: true
      });
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
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
