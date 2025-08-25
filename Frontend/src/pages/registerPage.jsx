import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        cutomerType: '',
        phone: '',
        email: '',
        address: '',
        monthlyAccess: '',

    });
    const [message, setMessage] = useState('')
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const customerData = {
            ...formData,
            Name: `${formData.firstName} ${formData.lastName}`
        };
        
        delete customerData.firstName;
        delete customerData.lastName;
        
        const response = await axios.post('http://localhost:3000/api/customers', customerData);
        console.log("Customer registered:", response.data);
        setMessage(`Customer ${response.data.data.Name} successfully registered`)
         setFormData({
            firstName: '',
            lastName: '',
            cutomerType: '',
            phone: '',
            email: '',
            address: '',
            monthlyAccess: '',
        });
    } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Something went wrong. Please try again.");
            }
    }
};

    return (
        <div>
           {message && (
    <div className={`mb-4 p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {message}
    </div>
)}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h1 className="text-xl mb-3 font-bold">Register Customer</h1>
                
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="firstName">First Name</label>
                    <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleChange} 
                        value={formData.firstName} 
                        placeholder="Juan" 
                        required 
                    />
                </div>
                
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="lastName">Last Name</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleChange} 
                        value={formData.lastName} 
                        placeholder="dela Cruz" 
                        required 
                    />
                </div>
                
                <div className="mb-5">
                    <label htmlFor="customerType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                    <select 
                        id="customerType" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleChange} 
                        value={formData.cutomerType} 
                        name="cutomerType" 
                        required
                    >
                        <option value="">Select member type</option>
                        <option value="monthly">Monthly</option>
                        <option value="member">Member</option>
                    </select>
                </div>
                  <div className="mb-5">
                    <label htmlFor="customerType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monthly Access</label>
                    <select 
                        id="customerType" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleChange} 
                        value={formData.monthlyAccess} 
                        name="monthlyAccess" 
                        required
                    >
                        <option value="">select Monthly Access</option>
                        <option value="Basic">Basic - 1 month gym access</option>
                        <option value="Silver">Silver - 2 month gym access</option>
                        <option value="Gold">Gold - 4 month gym access</option>
                    </select>
                </div>
                
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="phone">Phone</label>
                    <input 
                        type="number" 
                        id="phone" 
                        name="phone" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleChange} 
                        value={formData.phone} 
                        placeholder="eg. 09xxxxxxxxx" 
                        required 
                    />
                </div>
                
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleChange} 
                        value={formData.email} 
                        placeholder="juandelacruz@email.com" 
                        required 
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="address">Address</label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleChange} 
                        value={formData.address} 
                        placeholder="eg. street No. City, Province" 
                        required 
                    />
                </div>
                
                <button type="submit" className="text-white bg-blue-700 p-4 hover:bg-blue-800 rounded text-sm">Register</button>
            </form>
              

        </div>
    );
}

export default RegisterPage;