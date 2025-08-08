import axios from 'axios';
import { set } from 'mongoose';
import { User, Menu } from 'lucide-react'
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:3000/current-user', { withCredentials: true });
                if (response.data.success) {
                    setIsLoggedIn(true);
                    setUserRole(response.data.user.role);
                } else {
                    setIsLoggedIn(false);
                    setUserRole(null);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsLoggedIn(false);
                setUserRole(null);
            }
        }
        checkAuth();
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
            if (response.data.success) {
                setIsLoggedIn(false);
                navigate('/login'); // Redirect to home page after logout
            } else {
                alert(response.data.message); // Show error message
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        }
    }

    return (
        <nav className="bg-blue-500 border-gray-200 dark:bg-gray-900 mb-5">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to={'/'} className="text-white flex space-x-3 font-bold text-4xl">
                    <img src="https://scontent.fmnl43-1.fna.fbcdn.net/v/t39.30808-6/518380631_122149707662796142_2714769267742585064_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGY5lCoHNP7lWLxqA1X9s06EukDSplHRtYS6QNKmUdG1sk6bAO4y8TvM68cS49dLt4ZzEX7D8qaEzQemOIsKYZN&_nc_ohc=5eYucl0tBOUQ7kNvwGIR4_r&_nc_oc=AdmBDG-HXZzCl1XXxdvllk_EvFndMPjyTjB6cWKoG_-whVU2e47sTLFC2mL6HeopGjg&_nc_zt=23&_nc_ht=scontent.fmnl43-1.fna&_nc_gid=FnbFoJHt9RHlxLptLD4f3Q&oh=00_AfUQ2LbZySiOgajRvFxTy39INx14Zc6399mUhpCrACZY5A&oe=68969AA5" class="h-12 rounded" alt="Flowbite Logo" />
                </Link>
                  <button className="md:hidden">
                            <Menu className="h-6 w-6 text-white" />
                        </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-blue-500 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-blue-500 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link to={'/'} className="block py-2 px-3 text-white rounded-sm md:text-blue-200 md:p-0" >Home</Link>
                        </li>
                        {isLoggedIn && (
                            <li>
                                <Link to={'/customers'} className="block py-2 px-3 text-white rounded-sm hover:bg-blue-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">All Customers</Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <Link to={'/customers/register'} className="block py-2 px-3 text-white rounded-sm hover:bg-blue-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Add Customer</Link>
                            </li>
                        )}
                        {isLoggedIn && userRole === 'admin' && (
                            <li>
                                <Link to={'/users'} className="block py-2 px-3 text-white rounded-sm hover:bg-blue-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Users</Link>
                            </li>
                        )}
                      
                        {isLoggedIn && (
                            <Link to={'/profile'} className="text-white flex items-center space-x-2">
                                <User className="h-6 w-6" />
                                <span className="hidden md:inline">Profile</span>
                            </Link>
                        )}
                        {isLoggedIn && (
                            <li>
                                <button onClick={handleLogout} className="block py-2 px-3 text-white hover:bg-blue-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 dark:text-white">
                                    Logout
                                </button>
                            </li>
                        )}

                        {!isLoggedIn && (
                            <li>
                                <li>
                                    <Link to={'/login'} className="block py-2 px-3 text-white rounded-sm hover:bg-blue-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</Link>
                                </li>
                            </li>
                        )}
                    </ul>
                </div>

            </div>
        </nav>
    )
}