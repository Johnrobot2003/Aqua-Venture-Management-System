import { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Link, useNavigate } from "react-router-dom";
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password
            });
            if (response.data.success) {
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                const currentUserRes = await axios.get('http://localhost:3000/current-user', {
                    withCredentials: true
                })
                setMessage(currentUserRes.data.message)
                console.log("Login successful:", response.data.user);
                navigate('/');
            } else {
                setMessage(response.data.message)
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Something went wrong. Please try again.");
            }

        }
    }
    return (
        <div>
            <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                <div class="mb-5">
                    <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@email.com" required />
                </div>
                <div class="mb-5">
                    <label htmlFor="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="flex flex-col">
                      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                <Link to={'/forgot-password'} className="pt-[10px] text-purple-800 hover:underline">Forgot Password</Link>
                </div>
            </form>

            {message && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
                    {message}
                </div>
            )}


        </div>
    );

}