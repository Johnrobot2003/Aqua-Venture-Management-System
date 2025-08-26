import axios from "axios";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function RegisterUserPage() {
    const [formData, setFormData] = useState({
        email: '',
        role: '' // Default role
    })
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log("Current user in localStorage:", currentUser);
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/');
        } else {
            setUserRole(currentUser.role);
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://aqua-venture-backend.onrender.com/register', formData);
            console.log("User registered:", response.data);
            navigate('/users'); // Redirect to the home page after successful registration
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };
    return (
        userRole === "admin" && (
            <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                <h1 className="text-center font-bold text-2xl">Register User</h1>
                <form onSubmit={handleSubmit} className="max-w-sm mx-auto mb-5">
                    <div class="mb-5">
                        <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="email" value={formData.email} onChange={handleChange} placeholder="name@email.com" required />
                    </div>
                    <div class="mb-5">
                         <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="role">Role</label>
                    <select id="type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={formData.role} name="role" required>
                        <option  selected>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                    </select>
                    </div>
                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
                <Link to={'/users'} className="py-2.5 px-5 me-2 mt-3 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Back to List</Link>
               
            </div>
            
        )
    );
}