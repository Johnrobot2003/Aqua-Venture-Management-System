import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CheckInSystem({ isLoggedIn, userRole }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [buttonLoading, setButtonLoading] = useState(null)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://aqua-venture-backend.onrender.com/api/customers");

                // Only keep customers with monthlyStatus 'up to date'
                const filtered = response.data.data.filter(
                    (customer) => customer.monthlyStatus === "up to date"
                );

                setCustomers(filtered);
                setError(null);
            } catch (err) {
                console.error("Error fetching customers:", err);
                setError("Failed to load customers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);
    useEffect(() => {
        let filtered = customers;

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(customer => customer.Name.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        setFilteredCustomers(filtered);
    }, [customers, searchTerm]);

    const handleCheckIn = async (id) => {
        setButtonLoading(id)
        try {
            const response = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkIn`);
            setCustomers(customers.map((c) => (c._id === id ? response.data.data : c)));
        } catch (err) {
            setButtonLoading(null)
            console.error("Error checking in customer:", err);
            alert(err.response?.data?.message || "Error checking in customer");
        }finally{
            setButtonLoading(null)
        }
    };

    const handleCheckOut = async (id) => {
        setButtonLoading(id)
        try {
            const response = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkOut`);
            setCustomers(customers.map((c) => (c._id === id ? response.data.data : c)));
        } catch (err) {
            setButtonLoading(null)
            console.error("Error checking out customer:", err);
            alert(err.response?.data?.message || "Error checking out customer");
        }finally{
            setButtonLoading(null)
        }
    };

    if (loading){
         return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4 lg:p-6">
            {/* Search Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
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
                            onClick={() => setSearchTerm("")}
                            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 mb-4">
                Showing {filteredCustomers.length} of {customers.length} customers
            </p>

            {/* Customers Grid */}
            {filteredCustomers.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">
                        {customers.length === 0
                            ? "No customers found. Add a new customer to get started."
                            : searchTerm
                                ? `No customers match the name "${searchTerm}".`
                                : "No customers with 'up to date' monthly status."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredCustomers.map((customer) => (
                        <div
                            key={customer._id}
                            className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-transform"
                        >
                            <div className="p-4 md:p-6">
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                    {customer.Name}
                                </h5>

                                <div className="mb-3 space-y-2">
                                    <p className="text-gray-700 dark:text-gray-400 truncate">
                                        <span className="font-semibold">Type:</span> {customer.cutomerType}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400 truncate">
                                        <span className="font-semibold">Monthly Access:</span>{" "}
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${customer.monthlyAccess === "Basic"
                                                    ? "bg-gray-200 text-gray-800"
                                                    : customer.monthlyAccess === "Silver"
                                                        ? "bg-gray-400 text-white"
                                                        : "bg-yellow-500 text-yellow-900"
                                                }`}
                                        >
                                            {customer.monthlyAccess}
                                        </span>
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Phone:</span> {customer.phone}
                                    </p>
                                     <p className="text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Email:</span> {customer.email}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Monthly Status:</span>{" "}
                                        <span
                                            className={`inline-flex items-center ${customer.monthlyStatus === "up to date"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                } text-xs font-medium px-2.5 py-0.5 rounded-sm`}
                                        >
                                            {customer.monthlyStatus}
                                        </span>
                                    </p>
                                    <p className="flex items-center text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Checked in:</span>
                                        <span
                                            className={`ml-2 ${customer.isCheckedIn
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                    : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                                                } text-xs font-medium px-2.5 py-0.5 rounded-sm`}
                                        >
                                            {customer.isCheckedIn ? "Checked in" : "Checked out"}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {!customer.isCheckedIn ? (
                                        <button
                                            onClick={() => handleCheckIn(customer._id)}
                                            disabled = {buttonLoading === customer._id}
                                            className={`flex-1 min-w-[80px] px-3 py-2 text-sm font-medium text-center text-white  rounded-lg
                                            ${buttonLoading === customer._id 
                                                ? "bg-green-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                            }
                                                `}
                                        >
                                            {buttonLoading === customer._id ? "Checking in ..." : "Check in"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCheckOut(customer._id)}
                                            className={`flex-1 min-w-[80px] px-3 py-2 text-sm font-medium text-center text-white  rounded-lg
                                                ${buttonLoading === customer._id
                                                    ? "bg-yellow-400 cursor-not-allowed"
                                                    : "bg-yellow-600  hover:bg-yellow-700"
                                                }
                                                
                                                `}
                                        >
                                            {buttonLoading === customer._id ? "Checking out ..." : "Check out"}
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
