/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';

export default function BotActivator() {
  const [status, setStatus] = useState<'connecting' | 'active' | 'error'>('connecting');
  const [lastPing, setLastPing] = useState<string>('Нет данных');
  const [counter, setCounter] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [pingInterval, setPingInterval] = useState(10);
  const correctPassword = 'adminbot123';

  // Функция для пинга webhook
  async function pingWebhook() {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/telegram/ping');
      const endTime = Date.now();
      const pingTime = endTime - startTime;
      
      if (response.ok) {
        setStatus('active');
        setLastPing(new Date().toLocaleTimeString());
        setCounter(prev => prev + 1);
        console.log(`Ping успешен: ${pingTime}ms`);
        return true;
      } else {
        console.error('Ошибка при пинге:', await response.text());
        setStatus('error');
        return false;
      }
    } catch (error) {
      console.error('Ошибка подключения:', error);
      setStatus('error');
      return false;
    }
  }

  // Основная функция поддержания активности
  useEffect(() => {
    if (!isAuth) return;
    
    // Первоначальный пинг
    pingWebhook();
    
    // Настройка интервала пинга
    const interval = setInterval(() => {
      pingWebhook();
    }, pingInterval * 1000);
    
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, [isAuth, pingInterval]);

  // Обработчик входа
  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuth(true);
    } else {
      alert('Неверный пароль!');
    }
  };

  // Обработчик изменения интервала
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPingInterval(Number(e.target.value));
  };

  // Отображение информации о статусе
  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Активатор Telegram бота</h1>
          <p className="mb-4 text-gray-600">
            Эта страница поддерживает вашего Telegram бота в активном состоянии. 
            Введите пароль для активации:
          </p>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Активатор Telegram бота</h1>
        
        <div className="p-4 mb-4 border rounded-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Статус:</span>
            <span className={`px-3 py-1 rounded-full text-white font-medium ${
              status === 'active' ? 'bg-green-500' : 
              status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {status === 'active' ? 'Активен' : 
               status === 'connecting' ? 'Подключение...' : 'Ошибка'}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Последний пинг:</span>
            <span className="text-gray-700">{lastPing}</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Количество пингов:</span>
            <span className="px-2 py-1 text-white bg-blue-500 rounded">{counter}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold">Интервал пинга:</span>
            <select 
              value={pingInterval} 
              onChange={handleIntervalChange}
              className="px-2 py-1 border rounded"
            >
              <option value="1">1 секунда</option>
              <option value="10">10 секунд</option>
              <option value="15">15 секунд</option>
              <option value="30">30 секунд</option>
              <option value="60">1 минута</option>
            </select>
          </div>
        </div>
        
        <div className="p-4 mb-4 text-sm bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="font-semibold text-yellow-800 mb-1">⚠️ Важная информация</p>
          <p className="text-yellow-700">
            На бесплатном тарифе Vercel, cron-задания могут запускаться только один раз в день.
            <strong> Поэтому, пока эта страница открыта в браузере, бот будет отвечать мгновенно.</strong>
          </p>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          Эта страница поддерживает вашего Telegram бота в активном состоянии.
          Просто оставьте её открытой в любом браузере, и бот будет отвечать мгновенно.
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          Как это работает: регулярные запросы к API не дают
          Vercel serverless функции "заснуть". Таким образом, бот всегда остаётся активным.
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          <strong>Совет:</strong> Для мобильных устройств добавьте эту страницу на главный экран,
          чтобы она работала в режиме приложения и не закрывалась при блокировке экрана.
        </p>
        
        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={() => pingWebhook()}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Пинг сейчас
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Вы хотите добавить эту страницу на главный экран?')) {
                alert('На iOS: нажмите кнопку \'Поделиться\' и выберите \'На экран «Домой»\'\nНа Android: меню браузера → \'Установить приложение\'');
              }
            }}
            className="w-full px-4 py-2 font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Как добавить на главный экран
          </button>
        </div>
      </div>
    </div>
  );
} 