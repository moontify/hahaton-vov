'use client';

import { useEffect, useState } from 'react';

export default function BotActivator() {
  const [status, setStatus] = useState<'connecting' | 'active' | 'error'>('connecting');
  const [lastPing, setLastPing] = useState<string>('Нет данных');
  const [counter, setCounter] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const correctPassword = 'adminbot123'; // В реальном проекте используйте защищенный механизм

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
    
    // Настройка интервала пинга (каждые 15 секунд)
    const interval = setInterval(() => {
      pingWebhook();
    }, 15 * 1000);
    
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, [isAuth]);

  // Обработчик входа
  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuth(true);
    } else {
      alert('Неверный пароль!');
    }
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
          
          <div className="flex items-center justify-between">
            <span className="font-semibold">Количество пингов:</span>
            <span className="px-2 py-1 text-white bg-blue-500 rounded">{counter}</span>
          </div>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          Эта страница поддерживает вашего Telegram бота в активном состоянии.
          Просто оставьте её открытой в браузере, и бот будет отвечать мгновенно.
        </p>
        
        <p className="text-sm text-gray-600">
          Как это работает: каждые 15 секунд отправляется запрос к API, что не даёт
          Vercel serverless функции "заснуть". Таким образом, бот всегда остаётся активным.
        </p>
        
        <div className="mt-6">
          <button
            onClick={() => pingWebhook()}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Пинг сейчас
          </button>
        </div>
      </div>
    </div>
  );
} 