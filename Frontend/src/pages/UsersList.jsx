import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserList() {
    const [users,setUsers] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                setUsers(response.data.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();

        const interval = setInterval(() => {
            fetchUsers();
        }, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    return(
        <div className="container ml-20">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-6 mr-4">All Users</h1>
              <Link to={'/users/registerUser'} className="text-white bg-blue-500 border border-gray-300 transition-colors duration-3000 focus:outline-none hover:bg-blue-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" >Add User</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {users.map(user => (
                    <div key={user._id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {user.email}
                        </h5>
                        <p className="text-gray-700 dark:text-gray-400">
                            <span className="font-semibold">Role:</span> {user.role}
                        </p>
                          <div className="flex space-x-2 mt-4">
                            <button 
                                onClick={() => handleDelete(user._id)}
                                className="px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300">
                                Delete User
                            </button>
                             <Link 
                                to={`/users/updateUser/${user._id}`}
                                className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                Update User
                            </Link>
                        </div>
                    </div>
                      
                ))}
            </div>
        </div>
    )
}