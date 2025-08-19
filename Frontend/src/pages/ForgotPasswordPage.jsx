import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(
                "http://localhost:3000/forgot-password",
                { email },
                { withCredentials: true })

            if (res.data.success) {
                setMessage("Password Reset Link has now been sent to your email")
            } else {
                setMessage("Something went wrong")
            }
        } catch (error) {
            console.error(error);
            setMessage("Exception!!!")

        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                <h1 className="font-bold text-2xl">Reset Password form</h1>
                <div class="mb-5 mt-5">
                    
                    <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" required />
                </div>
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
            {message && (
                <div className="bg-green-100 p-5 mt-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {message}
                </div> )}
           
        </div>
    )
}