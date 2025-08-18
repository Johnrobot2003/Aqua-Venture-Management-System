import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/current-user', { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setEmail(res.data.user.email);
                    setRole(res.data.user.role);
                    setMessage(`Hello ${res.data.user.email}!`);
                }
            })
            .catch(() => setEmail(''));
    }, []);

    return (
        <div>
            {/* {message && (
                <div className="relative mb-4 p-3 rounded bg-green-100 text-green-800">
                    <span>{message}</span>
                    <button
                        onClick={() => setMessage('')}
                        className="absolute top-1 right-2 text-green-800 font-bold"
                    >
                        ✖
                    </button>
                </div>
            )} */}

            <h1 className="text-2xl font-bold">
                {email ? `Hello ${email}` : "Welcome to the Home Page"}
            </h1>
            <p>You serve currently as the {role}.</p>
        </div>
    );
}
