import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function DisplayPage() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/customers');
                setCustomers(response.data.data);
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        }
        fetchCustomers();

        const interval = setInterval(() => {
            fetchCustomers();
        }, 10000); // Refresh every 60 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/customers/${id}`);
            setCustomers(customers.filter(customer => customer._id !== id));
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    }

    return (
       <div className="container ml-20">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">All Customers</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {customers.map(customer => (
                    <div key={customer._id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {customer.Name}
                        </h5>
                        
                        <div className="mb-3 space-y-1">
                            <p className="text-gray-700 dark:text-gray-400">
                                <span className="font-semibold">Type:</span> {customer.cutomerType}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                                <span className="font-semibold">Phone:</span> {customer.phone}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                                <span className="font-semibold">Email:</span> {customer.email}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                                <span className="font-semibold">Address:</span> {customer.address}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                                <span className="font-semibold">Member Since:</span> {new Date(customer.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                                <span className="font-semibold">Expires:</span> {new Date(customer.expireAt).toLocaleDateString()}
                            </p>
                              <p className="text-gray-700 dark:text-gray-400">
                                <span className="font-semibold mr-3">Status:</span> 
                                <span className={`font-semibold ${customer.status === 'active' ? 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'}`}>
                                    {customer.status}
                                </span>
                            </p>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <button 
                                onClick={() => handleDelete(customer._id)}
                                className="px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                            >
                                Delete
                            </button>
                            <Link 
                                to={`/customers/editPage/${customer._id}`}
                                className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                            >
                                Edit
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DisplayPage;