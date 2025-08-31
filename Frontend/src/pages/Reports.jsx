import { useEffect, useState } from "react"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reports() {
    const [stats, setStats] = useState({
        TotalMembers: 0,
        TotalMonthly: 0,
          totalCustomers: 0,
        activeCustomers: 0,
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

    }, [])
    
    const chartData = {
  labels: ["Members", "Monthly"], // x-axis categories
  datasets: [
    {
     
      data: [stats.TotalMembers, stats.TotalMonthly], // y-axis values
      backgroundColor: [
        "rgba(54, 162, 235, 0.6)",  // Blue for Members
        "rgba(75, 192, 192, 0.6)"   // Green for Monthly
      ],
      borderColor: [
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)"
      ],
      borderWidth: 1,
    },
  ],
}
  if (loading) {
       return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }, // shows the "Total Count" label
    title: {
      display: true,
      text: "Member to Monthly Ratio",
    },
  },
}


    return (
  <div className="text-center">
    <h1 className="text-xl font-bold mb-4">Reports</h1>

    <div style={{ width: "400px", height: "300px", margin: "0 auto" }}>
      {!loading && <Bar data={chartData} options={chartOptions} />}
    </div>
  </div>
)

}