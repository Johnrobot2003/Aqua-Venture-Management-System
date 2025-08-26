import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children, allowedRoles }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://aqua-venture-backend.onrender.com/current-user', { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
}