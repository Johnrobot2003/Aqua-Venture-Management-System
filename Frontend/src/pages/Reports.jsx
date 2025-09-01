import { useEffect, useState } from "react"
import axios from "axios"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const [stats, setStats] = useState({
    TotalMembers: 0,
    TotalMonthly: 0,
    gold: 0,
    silver: 0,
    basic: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://aqua-venture-backend.onrender.com/api/reports')
        if (response.data.success) {
          setStats({
            TotalMembers: response.data.data.member,
            TotalMonthly: response.data.data.monthly,
            gold: response.data.data.gold,
            silver: response.data.data.silver,
            basic: response.data.data.basic,
          })
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false)
      }
    }

    fetchStats();
  }, [])

  const barChartData = {
    labels: ["Members", "Monthly"],
    datasets: [
      {
        data: [stats.TotalMembers, stats.TotalMonthly],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1,
      },
    ],
  }

  const donutChartData = {
    labels: ["Gold", "Silver", "Basic"],
    datasets: [
      {
        data: [stats.gold, stats.silver, stats.basic],
        backgroundColor: [
          "rgba(255, 215, 0, 0.8)",     // Gold
          "rgba(192, 192, 192, 0.8)",   // Silver
          "rgba(205, 133, 63, 0.8)",    // Basic (bronze-like)
        ],
        borderColor: [
          "rgba(255, 215, 0, 1)",
          "rgba(192, 192, 192, 1)",
          "rgba(205, 133, 63, 1)",
        ],
        borderWidth: 2,
        cutout: "60%", // This creates the donut hole
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Member to Monthly Ratio",
      },
    },
  }

  const donutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Monthly Access Distribution",
      },
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold mb-8">Reports Dashboard</h1>
      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Members</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.TotalMembers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Monthly</h3>
          <p className="text-2xl font-bold text-green-600">{stats.TotalMonthly}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Gold</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.gold}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">Silver</h3>
          <p className="text-2xl font-bold text-gray-600">{stats.silver}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800">Basic</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.basic}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div style={{ width: "100%", height: "300px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div style={{ width: "100%", height: "300px" }}>
            <Doughnut data={donutChartData} options={donutChartOptions} />
          </div>
        </div>
      </div>

    </div>
  )
}