import { useState, useEffect } from "react";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QrCheckInOutScanner({onSuccess}) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'success' or 'error'
    const [customerData, setCustomerData] = useState(null);

    const handleScan = async (result) => {
        if (!result || result.length === 0) return;
        
        try {
            // Get the first result's raw value
            const data = result[0].rawValue;
            const id = data.split('/').pop(); // Extract ID from URL
            const response = await axios.get(`https://aqua-venture-backend.onrender.com/api/customers/${id}`);
            const customer = response.data.data;

            if(!customer) {
                setError("Customer not found");
                setMessage(null);
                setModalType('error');
                setShowModal(true);
                return;
            }

            let output;
            if(customer.isCheckedIn) {
                output = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkOut`);
                setMessage(`Customer ${response.data.data.Name} successfully checked out`);
            } else {
                output = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkIn`);
                setMessage(`Customer ${response.data.data.Name} successfully checked in`);
            }
            
            setCustomerData(response.data.data);
            setModalType('success');
            setShowModal(true);
            onSuccess(response.data.data);
            console.log("Check-in/out successful:", response.data);
            setError(null);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
            setMessage(null);
            setModalType('error');
            setShowModal(true);
        }
    }

    const handleError = (error) => {
        console.error(error);
        setError("Error scanning QR code. Please try again.");
        setMessage(null);
        setModalType('error');
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setError(null);
        setMessage(null);
        setCustomerData(null);
    }

    // Auto close modal after 3 seconds for success
    useEffect(() => {
        if (showModal && modalType === 'success') {
            const timer = setTimeout(() => {
                closeModal();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showModal, modalType]);

    return(
        <div className="flex flex-col items-center justify-center relative">
            <h1>Scan here</h1>
            
            <div className="w-64 h-64 mt-4">
                <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{ 
                        facingMode: 'environment',
                        aspectRatio: 1
                    }}
                    styles={{
                        container: { width: '100%', height: '100%' },
                        video: { width: '100%', height: '100%', objectFit: 'cover' }
                    }}
                />
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full shadow-xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-bold ${modalType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {modalType === 'success' ? '✅ Success!' : '❌ Error'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="mb-6">
                            {modalType === 'success' ? (
                                <div>
                                    <p className="text-green-700 font-medium mb-3">{message}</p>
                                    {customerData && (
                                        <div className="bg-green-50 p-3 rounded-md">
                                            <p className="text-sm text-gray-600"><strong>Customer:</strong> {customerData.Name}</p>
                                            <p className="text-sm text-gray-600"><strong>Status:</strong> {customerData.isCheckedIn ? 'Checked In' : 'Checked Out'}</p>
                                            <p className="text-sm text-gray-600"><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-red-700 font-medium mb-3">{error}</p>
                                    <div className="bg-red-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-600">Please try scanning the QR code again or contact support if the problem persists.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className={`px-4 py-2 rounded-md font-medium ${
                                    modalType === 'success' 
                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            >
                                {modalType === 'success' ? 'Continue Scanning' : 'Try Again'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}