import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserList() {
    const [users,setUsers] = useState([])
    const [currentUserId, setCurrentUserId] = useState(null)
    useEffect(() => {

        const currentUser = async()=>{
            const res = await axios.get('https://aqua-venture-backend.onrender.com/current-user',{
                withCredentials: true
            })
            setCurrentUserId(res.data.user._id)
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://aqua-venture-backend.onrender.com/api/users');
                setUsers(response.data.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
        currentUser();

        const interval = setInterval(() => {
            fetchUsers();
        }, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://aqua-venture-backend.onrender.com/api/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    return(
        <div className="container mx-auto px-4 lg:ml-20 lg:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-blue-600">All Users</h1>
            <Link 
                to={'/users/registerUser'} 
                className="text-white bg-blue-500 border border-gray-300 transition-colors duration-300 focus:outline-none hover:bg-blue-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 self-start sm:self-auto dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
                Add User
            </Link>
        </div>
        
        <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                        <th scope="col" className="px-3 sm:px-6 py-3 whitespace-nowrap">Email</th>
                        <th scope="col" className="px-3 sm:px-6 py-3 whitespace-nowrap">Role</th>
                        <th scope="col" className="px-3 sm:px-6 py-3 whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
                                <div className="truncate max-w-[150px] sm:max-w-none" title={user.email}>
                                    {user.email}
                                </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                {user.role}
                            </td>
                            <td className="px-3 sm:px-6 py-4">
                                {user._id !== currentUserId && (
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 min-w-[120px]">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 whitespace-nowrap"
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            to={`/users/updateUser/${user._id}`}
                                            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 whitespace-nowrap"
                                        >
                                            Update
                                        </Link>
                                    </div>
                                )}
                                {user._id === currentUserId && (
                                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 whitespace-nowrap">
                                        Current User
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    )
}