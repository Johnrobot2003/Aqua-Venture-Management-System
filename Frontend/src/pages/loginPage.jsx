import { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Link, useNavigate } from "react-router-dom";
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post('https://aqua-venture-backend.onrender.com/login', {
        email,
        password
      }, {
        withCredentials: true
      });
      if (response.data.success) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        const currentUserRes = await axios.get('https://aqua-venture-backend.onrender.com/current-user', {
          withCredentials: true
        })
        setMessage(currentUserRes.data.message)
        console.log("Login successful:", response.data.user);
        navigate('/');
      } else {
        setLoading(false)
        setMessage(response.data.message)
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setLoading(false)
        setMessage(error.response.data.message);
      } else {
        setLoading(false)
        setMessage("Something went wrong. Please try again.");
      }

    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f6fd] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Right Side - Illustration (goes on top in small screens) */}
        <div className="w-full md:w-1/2 bg-[#f9fbff] flex flex-col items-center justify-center p-10 order-1 md:order-2">
          <img
            src="/LoginImage.png"
            alt="AFG"
            className="w-48 md:w-64 mb-6"
          />
        </div>

        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 order-2 md:order-1">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-medium py-2.5 rounded-lg text-white ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Logging in ..." : "Login"}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded bg-red-100 text-red-800 text-sm">{message}</div>
          )}
        </div>
      </div>
    </div>
  );


}