import axios from "axios";
import { useEffect, useState } from "react";

export default function homePage() {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    
    useEffect(() => {
        axios.get('http://localhost:3000/current-user', { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setEmail(res.data.user.email);
                    setRole(res.data.user.role);
                }
            })
            .catch(() => setEmail(''));
    }, []);
    return (
       <div>
            <h1 className="text-2xl font-bold">
                {email ? `Hello ${email}` : "Welcome to the Home Page"}
            </h1>
            <p>You serve currently as the {role}.</p>
        </div>
    );
}