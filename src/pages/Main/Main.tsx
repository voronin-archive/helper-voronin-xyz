import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import MainLayout from '../../layouts/MainLayout';
import { alert } from '../../services/alerting.service';
import authService from '../../services/auth.service';
import RouteService from '../../services/route.service';
import IResult from '../../types/result.interface';
import s from './main.module.scss';

const Main = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const sendData = async () => {
    if (!email || email === '') {
      return alert("error", "Заполните форму", "Укажите Вашу почту", 15);
    }

    if (!password || password === '') {
      return alert("error", "Заполните форму", "Укажите пароль", 15);
    }

    const formData = new FormData();
    formData.append('login', email);
    formData.append('password', password);

    axios.post(`${config.API}/auth/login`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then(({ data }) => {
      if(data.status === "error") {
        return alert("error", "Что-то пошло не так...", data.message, 15);
      } else if(data.status === "success") {
        localStorage.accountToken = data.data.token;
        alert("default", "Успешный вход!", "Теперь Вы можете продолжать пользоваться нашим сервисом.", 15);
        navigate('/dashboard');
      }
    }).catch(e => {
      if (e.code === 'ERR_NETWORK') {
        alert("error", "Произошла ошибка", "Сервер временно недоступен, попробуйте позже", 10);
      }
      console.warn(e);
    });
  }

  const routeService = new RouteService(navigate);

  useEffect(() => {
    authService.checkAuth().then(r => {
      r && routeService.dashboard(); 
    });
  }, [navigate]);

  return(
    <MainLayout title={"Добро пожаловать!"}>
      <div className={`container ${s.mainWrapper}`}>
        <div className={s.leftSide}>
          <h1>Добро пожаловать!</h1>
          <p>Helper - сервис, помогающий в поиске неисправностей и оптимизации работы на участке.</p>
          <p className={s.auth}>Для продолжения необходимо авторизоваться</p>

          <input type="text" placeholder="Email" value={email} onChange={({target}) => setEmail(target.value)} />
          <input type="password" placeholder="Пароль" value={password} onChange={({target}) => setPassword(target.value)} />
          <button onClick={sendData}>Войти</button>
        </div>
      </div>
    </MainLayout>
  )
}

export default Main;