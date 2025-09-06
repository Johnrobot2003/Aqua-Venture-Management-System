import { useState,useEffect } from "react";

import axios from "axios";
import {QrReader} from "react-qr-reader";

export default function QrCheckInOutScanner({onSuccess}) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);


    const handleScan = async (data) => {
        if (!data) {
            return
        }
        if(data) {
            try {
                const id = data.split('/').pop(); // Extract ID from URL
                const response = await axios.get(`https://aqua-venture-backend.onrender.com/api/customers/${id}`);
                const customer = response.data.data;

                if(!customer) {
                    setError("Customer not found");
                    setMessage(null);
                    return;
                }

                let output;
                if(customer.isCheckedIn) {
                    output = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkOut`);
                    setMessage(`Customer ${response.data.data.Name} successfully checked out`);
                }else{
                    output = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkIn`);
                    setMessage(`Customer ${response.data.data.Name} successfully checked in`);
                }
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
            }
        }
    }

    const handleError = (err) => {
        console.error(err);
        setError("Error scanning QR code. Please try again.");
        setMessage(null);
    }

    return(
        <div className= "flex flex-col items-center justify-center">
            <h1>Scan here</h1>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <div className="w-64 h-64">
                <QrReader
                    constraints={{ facingMode: 'environment' }}
                    onResult={(result, error) => {
                        if (!!result) {
                            handleScan(result?.text);
                        }
                        if (!!error) {
                            handleError(error);
                        }
                    }}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

        </div>
        
        
    )
}