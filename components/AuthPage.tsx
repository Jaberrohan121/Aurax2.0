
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => boolean;
  onSignup: (userData: Partial<User>) => boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', phone: '', address: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      if (!onLogin(formData.email, formData.password)) {
        setError('Invalid credentials');
      }
    } else {
      if (!onSignup(formData)) {
        setError('Email already exists');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-amber-600 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              {ICONS.Watch}
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AURAX WATCH</h1>
          <p className="opacity-80 mt-2">Premium Timeless Collection</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" required
                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input 
                      type="tel" required
                      className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" required
                      className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                  <textarea 
                    required
                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </>
            )}
            
            {isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" required
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" required
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-amber-600 hover:underline font-medium"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
