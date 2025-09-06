import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";
import { Link } from "react-router-dom";

export default function QrScannerPage() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [manualId, setManualId] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const scannerRef = useRef(null);

  // Check camera permissions
  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        // Check if browser supports mediaDevices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Camera access is not supported in this browser");
          setHasPermission(false);
          return;
        }

        // Try to get camera permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        
        // Close the stream immediately since we just wanted to check permissions
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Camera permission error:", err);
        setError("Camera access denied. Please enable camera permissions in your browser settings.");
        setHasPermission(false);
      }
    };

    checkCameraPermissions();
  }, []);

  const handleScan = async (data) => {
    if (!data || !isScanning) return;

    setIsScanning(false); // Prevent multiple scans
    
    try {
      const id = data.split('/').pop(); // Extract ID from URL
      const response = await axios.get(`https://aqua-venture-backend.onrender.com/api/customers/${id}`);
      const customer = response.data.data;

      if (!customer) {
        setError("Customer not found");
        setMessage(null);
        setIsScanning(true);
        return;
      }

      let output;
      if (customer.isCheckedIn) {
        output = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkOut`);
        setMessage(`Customer ${response.data.data.Name} successfully checked out`);
      } else {
        output = await axios.post(`https://aqua-venture-backend.onrender.com/api/customers/${id}/checkIn`);
        setMessage(`Customer ${response.data.data.Name} successfully checked in`);
      }
      
      console.log("Check-in/out successful:", response.data);
      setError(null);
      
      // Reset scanning after a short delay
      setTimeout(() => {
        setIsScanning(true);
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Scan error:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setMessage(null);
      setIsScanning(true);
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner error:", err);
    setError("Error accessing camera. Please check permissions or try manual entry.");
    setHasPermission(false);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    
    setIsScanning(false);
    try {
      // Prepend a slash to simulate the URL structure from QR codes
      await handleScan(`/${manualId}`);
    } catch (err) {
      console.error("Manual submit error:", err);
      setError("Invalid customer ID");
      setIsScanning(true);
    }
  };

  const retryCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError("Still unable to access camera. Please check browser settings.");
    }
  };

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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 p-3" 
            onClick={() => setError(null)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {message}
        </div>
      )}

      {hasPermission === false && !showManualInput && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="mb-2">Camera access is unavailable. You can:</p>
          <div className="flex space-x-2">
            <button
              onClick={retryCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry Camera
            </button>
            <button
              onClick={() => setShowManualInput(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Enter ID Manually
            </button>
          </div>
        </div>
      )}

      {showManualInput ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Manual Customer ID Entry</h2>
          <form onSubmit={handleManualSubmit}>
            <div className="mb-4">
              <label htmlFor="manualId" className="block text-gray-700 mb-2">
                Customer ID
              </label>
              <input
                type="text"
                id="manualId"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer ID"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowManualInput(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back to Scanner
              </button>
            </div>
          </form>
        </div>
      ) : hasPermission && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          <div className="scanner-container w-64 h-64 relative">
            <QrReader
              ref={scannerRef}
              constraints={{ 
                facingMode: 'environment',
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 } 
              }}
              onResult={(result, error) => {
                if (result) {
                  handleScan(result.text);
                }
                if (error) {
                  console.info(error); // Don't show every error to the user
                }
              }}
              containerStyle={{ width: '100%', height: '100%' }}
              videoContainerStyle={{ width: '100%', height: '100%', padding: 0 }}
              videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="scan-area">
              <div className="scan-line"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">Position the QR code within the frame</p>
          
          <button
            onClick={() => setShowManualInput(true)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Enter ID Manually
          </button>
        </div>
      )}
    </div>
  );
}