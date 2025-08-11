import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CheckInHistory() {
    const { id } = useParams();
    const [checkIns, setCheckIns] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const fetchCheckInHistory = async () => {
            try {
                const historyResponse = await axios.get(`http://localhost:3000/api/customers/${id}/checkins`);
                console.log('History API Response:', historyResponse.data); // Debug log
                
               
                const customerResponse = await axios.get(`http://localhost:3000/api/customers/${id}`);
                console.log('Customer API Response:', customerResponse.data); // Debug log
                
                setCheckIns(historyResponse.data.data || []);
                setIsCheckedIn(historyResponse.data.isCheckedIn || false);
                setCustomerName(customerResponse.data.data?.Name || 'Unknown Customer');
                setLoading(false);
            } catch (err) {
                console.error('API Error:', err); // Debug log
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
                <div className="text-lg">Loading check-in history...</div>
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

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {checkIns && checkIns.length > 0 ? (
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
                            {checkIns.map((checkIn, index) => (
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
                            This customer hasn't checked in yet.
                        </div>
                    </div>
                )}
            </div>
            <div className='pt-[20px]'>
                <Link to={'/customers'} className="py-2.5 px-5 me-2 mt-3 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-blue-500 rounded-lg border border-gray-200 hover:bg-blue-600  focus:z-10 focus:ring-4 focus:ring-blue-400 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Back to List</Link>
            </div>
           
        </div>
    );
}