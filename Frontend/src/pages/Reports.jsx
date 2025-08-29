import { useEffect, useState } from "react"
import axios from "axios"
export default function Reports() {
    const [stats, setStats] = useState({
        TotalMembers: 0,
        TotalMonthly: 0
    })
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        const fetchStats = async () => {
            try {
                const response = await axios.get('https://aqua-venture-backend.onrender.com/api/reports')
                if (response.data.success) {
                    setStats({
                        TotalMembers: response.data.data.member,
                        TotalMonthly: response.data.data.monthly
                    })
                }
            } catch {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false)
            }
        }
        fetchStats();

    })

    return (

        <div>
            <h1>Reports</h1>

            <h1>Total number of members: <span className="text-blue-500">{loading ? '...' : stats.TotalMembers}</span></h1>
            <h1>Total number of monthly: <span className="text-green-500">{loading ? '...' :  stats.TotalMonthly}</span></h1>
        </div>

    )
}