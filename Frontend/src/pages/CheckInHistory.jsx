import { useParams, Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CheckInHistory() {
    const { id } = useParams();
    const [checkIns, setCheckIns] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(""); // new state for filtering
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCheckInHistory = async () => {
            try {
                const historyResponse = await axios.get(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkins`);
                console.log('History API Response:', historyResponse.data);
                
                const customerResponse = await axios.get(`https://aqua-venture-backend.onrender.com/api/customers/${id}`);
                console.log('Customer API Response:', customerResponse.data);
                
                setCheckIns(historyResponse.data.data || []);
                setIsCheckedIn(historyResponse.data.isCheckedIn || false);
                setCustomerName(customerResponse.data.data?.Name || 'Unknown Customer');
                setLoading(false);
            } catch (err) {
                console.error('API Error:', err);
                setError(err.response?.data?.message || 'Failed to load check-in history');
                setLoading(false);
            }
        };

        if (id) {
            fetchCheckInHistory();
        } else {
            setError('No customer ID provided');
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-lg">Error: {error}</div>
            </div>
        );
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1)
        } else {
            navigate('/customers')
        }
    }

    // filter checkIns by selectedDate
    const filteredCheckIns = selectedDate
        ? checkIns.filter((checkIn) => {
            if (!checkIn.checkInTime) return false;
            const checkInDate = new Date(checkIn.checkInTime).toISOString().split("T")[0];
            return checkInDate === selectedDate;
        })
        : checkIns;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Check-In History for {customerName}
                </h1>
                {isCheckedIn && (
                    <div className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Currently Checked In
                    </div>
                )}
            </div>

            {/* Date filter input */}
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Filter by Date:
                </label>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                />
                {selectedDate && (
                    <button 
                        onClick={() => setSelectedDate("")}
                        className="py-2.5 px-5 ml-2 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {filteredCheckIns && filteredCheckIns.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Check-In Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Check-Out Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration (minutes)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCheckIns.map((checkIn, index) => (
                                <tr key={checkIn._id || index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {checkIn.checkInTime 
                                            ? new Date(checkIn.checkInTime).toLocaleString()
                                            : 'N/A'
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {checkIn.checkOutTime
                                            ? new Date(checkIn.checkOutTime).toLocaleString()
                                            : '-'
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {checkIn.duration ? `${checkIn.duration} min` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {checkIn.checkOutTime ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-2">No Check-In Records Found</div>
                        <div className="text-gray-400 text-sm">
                            {selectedDate 
                                ? `No records found for ${selectedDate}` 
                                : "This customer hasn't checked in yet."}
                        </div>
                    </div>
                )}
            </div>
            <div className='pt-[20px]'>
                <button onClick={handleBack} className="py-2.5 px-5 me-2 mt-3 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-blue-500 rounded-lg border border-gray-200 hover:bg-blue-600  focus:z-10 focus:ring-4 focus:ring-blue-400 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Back to List</button>
            </div>
        </div>
    );
}
