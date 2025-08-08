import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: '',
        cutomerType: '',
        phone: '',
        email: '',
        address: ''

    });
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
            const response = await axios.post('http://localhost:3000/api/customers', formData);
            console.log("Customer registered:", response.data);
            navigate('/customers'); // Redirect to the customers page after successful registration
        } catch (error) {
            console.error("Error registering customer:", error);
        }
    };

    return (
        <div>
           
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                 <h1 className="text-xl mb-3 font-bold">Register Customer</h1>
                <div class="mb-5">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="name">Name</label>
                    <input type="text" id="name" name="Name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={formData.Name} placeholder="name@flowbite.com" required />
                </div>
                <div class="mb-5">
                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="type">Type</label>
                    <select id="type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={formData.cutomerType} name="cutomerType" required>
                        <option  selected>Select member type</option>
                        <option value="monthly">Monthly</option>
                        <option value="member">Member</option>
                    </select>
                </div>
                  <div class="mb-5">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="phone">Phone</label>
                    <input type="number" id="phone" name="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={formData.phone} placeholder="eg. 09xxxxxxxxx" required />
                </div>
                <div class="mb-5">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={formData.email} placeholder="juandelacruz@email.com" required />
                </div>

                  <div class="mb-5">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} value={formData.address} placeholder="eg. street No. City, Province" required />
                </div>
               <button type="submit" className="text-white bg-blue-700 p-4 hover:bg-blue-800 rounded text-sm">Register</button>
            </form>







        </div>


    );
}
export default RegisterPage;