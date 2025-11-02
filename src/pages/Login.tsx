import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const { login, settings } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const result = login(username, password);

    if (result.success) {
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } else if (result.needsEmail) {
      setShowEmailVerification(true);
      toast.error(result.message || 'Verifikasi email diperlukan');
    } else {
      toast.error(result.message || 'Login gagal');
    }
  };

  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email verification - in real app, this would verify against a sent code
    if (verificationCode === '123456') {
      toast.success('Verifikasi berhasil! Silakan login kembali.');
      setShowEmailVerification(false);
      setVerificationCode('');
      // Reset login attempts
      useStore.getState().resetLoginAttempts(username);
    } else {
      toast.error('Kode verifikasi salah');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}
    >
      <div className="w-full max-w-md">
        <div
          className={`rounded-2xl shadow-2xl p-8 ${
            settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
          }`}
        >
          {/* Logo/Image */}
          {settings.loginImage && (
            <div className="flex justify-center mb-6">
              <img src={settings.loginImage} alt="Login" className="h-24 w-24 object-cover rounded-full" />
            </div>
          )}

          {/* Store Logo */}
          {settings.storeLogo && !settings.loginImage && (
            <div className="flex justify-center mb-6">
              <img src={settings.storeLogo} alt={settings.storeName} className="h-20 object-contain" />
            </div>
          )}

          {/* Store Name */}
          <h1 className="text-3xl font-bold text-center mb-2">
            {settings.storeName || 'Toko Saya'}
          </h1>

          {/* Login Message */}
          <p className={`text-center mb-8 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {settings.loginMessage || 'Silahkan Masukkan Username dan Password'}
          </p>

          {!showEmailVerification ? (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    settings.theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Masukkan username"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      settings.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } hover:text-blue-500`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Masuk
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailVerification} className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Mail className="text-blue-600" size={40} />
                </div>
              </div>

              <p className={`text-center ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Kode verifikasi telah dikirim ke email Anda. Masukkan kode untuk melanjutkan.
              </p>

              <div>
                <label className={`block text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kode Verifikasi
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    settings.theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Verifikasi
              </button>

              <button
                type="button"
                onClick={() => setShowEmailVerification(false)}
                className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                  settings.theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Kembali
              </button>
            </form>
          )}

          {/* Footer */}
          <div className={`mt-8 pt-6 border-t text-center text-sm ${
            settings.theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
          }`}>
            © 2025 gilar206@hotmail.co.uk
          </div>
        </div>
      </div>
    </div>
  );
}
