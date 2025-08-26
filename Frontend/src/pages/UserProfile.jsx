import { set } from "mongoose"
import { useEffect, useState } from "react"

export default function UserProfile(){
    const [user, setUser] = useState(null)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)

     useEffect(() => {
        fetch("https://aqua-venture-backend.onrender.com/current-user", {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(data.user);
                } else {
                    setIsError(true);
                    setMessage("Please log in first.");
                }
            });
   
    }, []);

    if (!user) {
           return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
     const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("https://aqua-venture-backend.onrender.com/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await res.json();

            setIsError(!data.success);
            setMessage(data.message);
        } catch (err) {
            setIsError(true);
            setMessage("Error changing password");
        }
        setOldPassword('');
        setNewPassword('');
    };

  return (
        <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">{user.role}</span></p>

            <hr className="my-4" />

            <h3 className="text-lg font-semibold mb-2">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Change Password
                </button>
            </form>

              {message && (
                <p className={`mt-3 text-sm ${isError ? "text-red-700" : "text-green-700"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}