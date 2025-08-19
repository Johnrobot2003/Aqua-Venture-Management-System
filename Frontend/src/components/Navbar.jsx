import axios from 'axios';
import { set } from 'mongoose';
import { User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isInMobile, setIsInMobile] = useState(false)
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

    const toggleMobileMenu = ()=>{
        setIsInMobile(!isInMobile)
    }

    useEffect(()=>{
        setIsInMobile(false)
    },[location.pathname])

    return (
        <nav className="bg-blue-500 border-gray-200 dark:bg-gray-900 mb-5">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to={'/'} className="text-white flex space-x-3 font-bold text-4xl">
                    <img src="/AFGLogo.jpg" class="h-12 rounded" />
                </Link>
                  <button className="md:hidden" onClick = {toggleMobileMenu}>
                    {isInMobile ?(
                        <X className="h-6 w-6 text-white" />
                    ):(
                         <Menu className="h-6 w-6 text-white" />
                    )}
                        </button>
                        {/* Desktop view */}
                <div className="hidden md:block" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-blue-500 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-blue-500 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link to={'/'}  className="block py-2 px-3 text-white rounded-sm hover:bg-blue-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" >Home</Link>
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
                            <Link to={'/profile'}  className="flex py-2 px-3 text-white rounded-sm hover:bg-blue-600 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
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
                {/* In mobile view */}
                 <div className={`${isInMobile ? 'block' : 'hidden'} w-full md:hidden mt-4`}>
                    <ul className="font-medium flex flex-col space-y-2 p-4 bg-blue-700 rounded-lg">
                        <li>
                            <Link 
                                to={'/'} 
                                className="block py-2 px-3 text-white hover:bg-blue-700 rounded transition-colors"
                            >
                                Home
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <li>
                                <Link 
                                    to={'/customers'} 
                                    className="block py-2 px-3 text-white hover:bg-blue-700 rounded transition-colors"
                                >
                                    All Customers
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <Link 
                                    to={'/customers/register'} 
                                    className="block py-2 px-3 text-white hover:bg-blue-700 rounded transition-colors"
                                >
                                    Add Customer
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && userRole === 'admin' && (
                            <li>
                                <Link 
                                    to={'/users'} 
                                    className="block py-2 px-3 text-white hover:bg-blue-700 rounded transition-colors"
                                >
                                    Users
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <Link 
                                    to={'/profile'} 
                                    className="flex items-center space-x-2 py-2 px-3 text-white hover:bg-blue-700 rounded transition-colors"
                                >
                                    <User className="h-5 w-5" />
                                    <span>Profile</span>
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <button 
                                    onClick={handleLogout} 
                                    className="block w-full text-left py-2 px-3 text-white hover:bg-blue-700 rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                        {!isLoggedIn && (
                            <li>
                                <Link 
                                    to={'/login'} 
                                    className="block py-2 px-3 text-white hover:bg-blue-700 rounded transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            
        </nav>
    )
}