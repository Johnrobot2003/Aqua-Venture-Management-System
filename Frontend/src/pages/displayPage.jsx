import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function DisplayPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkinFilter, setCheckinFilter] = useState('all');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [typeFilter, setTypeFilter] = useState('all')
    const [memberFilter, setMemberFilter] = useState('all')
    const [userRole, setUserRole] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://aqua-venture-backend.onrender.com/api/customers');
                setCustomers(response.data.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching customers:", error);
                setError("Failed to load customers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();

        // const interval = setInterval(() => {
        //     fetchCustomers();
        // }, 10000);

        // return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        let filtered = customers;

        if (checkinFilter !== 'all') {
            const isCheckedIn = checkinFilter === 'checkedin';
            filtered = filtered.filter(customer => customer.isCheckedIn === isCheckedIn);
        }
        if (typeFilter !== 'all') {
            filtered = filtered.filter(customer => customer.monthlyAccess === typeFilter);
        }
        if (memberFilter !== 'all') {
            filtered = filtered.filter(customer => customer.cutomerType === memberFilter)
        }
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(customer => customer.Name.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        setFilteredCustomers(filtered);
    }, [customers, checkinFilter, typeFilter, memberFilter, searchTerm]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('https://aqua-venture-backend.onrender.com/current-user', { withCredentials: true });
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
    }, [])

    const handleCheckIn = async (id) => {
        try {
            const response = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkIn`);
            setCustomers(customers.map(customer =>
                customer._id === id ? response.data.data : customer
            ));
        } catch (error) {
            console.error("Error checking in customer:", error);
            alert(error.response?.data?.message || "Error checking in customer");
        }
    };

    const handleCheckOut = async (id) => {
        try {
            const response = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkOut`);
            setCustomers(customers.map(customer =>
                customer._id === id ? response.data.data : customer
            ));
        } catch (error) {
            console.error("Error checking out customer:", error);
            alert(error.response?.data?.message || "Error checking out customer");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://aqua-venture-backend.onrender.com/api/customers/${id}`);
            setCustomers(customers.filter(customer => customer._id !== id));
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Failed to delete customer. Please try again.");
        }
    };

    const clearFilter = () => {
        setCheckinFilter('all');
        setTypeFilter('all')
        setMemberFilter('all')
        setSearchTerm('')
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-600">All Customers</h1>
                <Link
                    to="/customers/register"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Add New Customer
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
                <div className="flex items-center gap-4">
                    <label className="text-lg font-semibold text-gray-700">Search:</label>
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
                <div className="flex flex-wrap gap-4 items-center">
                    <h3 className="text-lg font-semibold text-gray-700 mr-4">Filter:</h3>

                    {/* Check-in Status Filter */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Check-in Status</label>
                        <select
                            value={checkinFilter}
                            onChange={(e) => setCheckinFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Customers</option>
                            <option value="checkedin">Checked In</option>
                            <option value="checkedout">Checked Out</option>
                        </select>

                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Type Filter</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="Basic">Basic</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                        </select>

                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Customer Types Filter</label>
                        <select
                            value={memberFilter}
                            onChange={(e) => setMemberFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Customer Types</option>
                            <option value="member">Member</option>
                            <option value="monthly">Monthly</option>
                        </select>

                    </div>

                    {/* Clear Filter Button */}
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={clearFilter}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Clear Filter
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Showing {filteredCustomers.length} of {customers.length} customers
                    </p>
                </div>
            </div>

            {filteredCustomers.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">
                        {customers.length === 0
                            ? "No customers found. Add a new customer to get started."
                            : searchTerm
                                ? `No customers matches the name "${searchTerm}".`
                                : "No customers match the selected filter."
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredCustomers.map(customer => (
                        <div key={customer._id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-transform ">
                            <div className="p-4 md:p-6">
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                    {customer.Name}
                                </h5>

                                <div className="mb-3 space-y-2">
                                    <p className="text-gray-700 dark:text-gray-400 truncate">
                                        <span className="font-semibold">Type:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${customer.cutomerType === 'monthly' 
                                        ? 'bg-yellow-500 text-gray-800'
                                        :  'bg-gray-200 text-gray-800'}`}>
                                            {customer.cutomerType}
                                        </span>
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400 truncate">
                                        <span className="font-semibold">Monthly Access:</span> <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${customer.monthlyAccess === 'Basic'
                                                ? 'bg-gray-200 text-gray-800'
                                                : customer.monthlyAccess === 'Silver'
                                                    ? 'bg-gray-400 text-white'
                                                    : 'bg-yellow-500 text-yellow-900'
                                                }`}
                                        >
                                            {customer.monthlyAccess}
                                        </span>
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Phone:</span> {customer.phone}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Created At: </span> {new Date(customer.createdAt).toLocaleDateString()}
                                    </p>

                                    {customer.cutomerType === 'member' &&
                                        <p className="text-gray-700 dark:text-gray-400">
                                            <span className="font-semibold">Membership Expires:</span> {new Date(customer.expireAt).toLocaleDateString()} <span className={`inline-flex items-center ${customer.status === 'currently active' ?
                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'} 
                                            text-xs font-medium px-2.5 py-0.5 rounded-sm`}>
                                                {customer.status}
                                            </span>
                                        </p>
                                    }
                                    <p className="text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Monthly Access Valid till:</span> {new Date(customer.monthlyExpires).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Monthly status:</span>  <span className={`inline-flex items-center ${customer.monthlyStatus === 'up to date' ?
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'} 
                                            text-xs font-medium px-2.5 py-0.5 rounded-sm`}>
                                            {customer.monthlyStatus}
                                        </span>
                                    </p>
                                    {/* <p className="flex items-center text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold mr-2">Status:</span>
                                        <span className={`inline-flex items-center ${customer.status === 'active' ?
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'} 
                                            text-xs font-medium px-2.5 py-0.5 rounded-sm`}>
                                            {customer.status}
                                        </span>
                                    </p> */}
                                    <p className="flex items-center text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Checked in:</span>
                                        <span className={`ml-2 ${customer.isCheckedIn ?
                                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                            'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'} 
                                            text-xs font-medium px-2.5 py-0.5 rounded-sm`}>
                                            {customer.isCheckedIn ? 'Checked in' : 'Checked out'}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {isLoggedIn && userRole === 'admin' && (
                                        <button
                                            onClick={() => handleDelete(customer._id)}
                                            className="flex-1 min-w-[80px] px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <Link
                                        to={`/customers/editPage/${customer._id}`}
                                        className="flex-1 min-w-[80px] px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors"
                                    >
                                        Info
                                    </Link>
                                    {!customer.isCheckedIn ? (
                                        <button
                                            onClick={() => handleCheckIn(customer._id)}
                                            className="flex-1 min-w-[80px] px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 transition-colors"
                                        >
                                            Check In
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCheckOut(customer._id)}
                                            className="flex-1 min-w-[80px] px-3 py-2 text-sm font-medium text-center text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 transition-colors"
                                        >
                                            Check Out
                                        </button>
                                    )}
                                    <Link
                                        to={`/customers/${customer._id}/checkInHistory`}
                                        className="flex-1 min-w-[80px] px-3 py-2 text-sm font-medium text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 transition-colors"
                                    >
                                        History
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DisplayPage;