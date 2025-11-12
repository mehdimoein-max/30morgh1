import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeatherIcon } from '../../components/Icons';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
          const result = await response.json().catch(() => ({ message: 'API login failed' }));
          throw new Error(result.message);
      }
      
      const result = await response.json();

      if (result.success) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err) {
      console.log("API not available. Using fallback authentication.");
      if (username === 'admin' && password === 'password') {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('نام کاربری یا رمز عبور اشتباه است.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
            <FeatherIcon className="h-12 w-12 text-[#00bfa6]" />
            <h2 className="mt-4 text-2xl font-bold text-center text-gray-800">
             ورود به پنل مدیریت هلدینگ سیمرغ
            </h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-right">
              نام کاربری
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bfa6]"
              placeholder="admin"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-right">
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bfa6]"
              placeholder="password"
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold py-2 px-4 bg-[#00bfa6] text-white rounded-md hover:bg-[#00a793] transition-colors duration-300 disabled:bg-gray-400"
            >
              {isLoading ? 'در حال بررسی...' : 'ورود'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;