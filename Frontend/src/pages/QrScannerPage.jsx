import { useState } from "react";
import QrCheckInOutScanner from "../components/QrCheckInOutScanner.jsx";
import { Link } from "react-router-dom";

export default function QrScannerPage() {
    const [scanMode, setScanMode] = useState(true);
    
    const handleSuccess = (customer) => {
       console.log("Customer processed:", customer);
    }
    
    return (
        <div className="container mx-auto p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">QR Check-In/Check-Out</h1>
                <Link
                    to="/checkin"
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                    Back to Manual Check-In
                </Link>
            </div>
            
            {scanMode && <QrCheckInOutScanner onSuccess={handleSuccess} />}
        </div>
    )
}