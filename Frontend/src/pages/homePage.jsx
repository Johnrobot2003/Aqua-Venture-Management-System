import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        checkedInToday: 0,
        expiringThisWeek: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/current-user', { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setEmail(res.data.user.email);
                    setRole(res.data.user.role);
                    setMessage(`Welcome back, ${res.data.user.email}!`);
                }
            })
            .catch(() => setEmail(''));
    }, []);

    useEffect(() => {
        // Fetch dashboard statistics
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dashboard/stats');
               if (response.data.success) {
                setStats(response.data.data)
               }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        // Fetch recent activity
        const fetchRecentActivity = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dashboard/recent-activity');
                if (response.data.success) {
                    setRecentActivity(response.data.data)
                }
            } catch (error) {
                console.error('Error fetching recent activity:', error);
            }
        };

        if (email) {
            fetchStats();
            fetchRecentActivity();
        }
    }, [email]);

    const StatCard = ({ title, value, icon, color, trend }) => (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.positive ? '↗' : '↘'} {trend.value}
                        </p>
                    )}
                </div>
                <div className="text-3xl">{icon}</div>
            </div>
        </div>
    );

    const QuickAction = ({ title, description, link, icon, color }) => (
        <Link
            to={link}
            className={`block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${color}`}
        >
            <div className="flex items-center">
                <div className="text-2xl mr-4">{icon}</div>
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </Link>
    );

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Aqua Venture Management
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Please log in to access your dashboard
                    </p>
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            {/* Welcome Header */}
            <div className="mb-8">
                
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Welcome , <span className="font-semibold">{email}</span>
                            {role && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{role}</span>}
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Customers"
                    value={loading ? "..." : stats.totalCustomers}
                    icon="👥"
                    color="border-blue-500"
                />
                <StatCard
                    title="Active Members"
                    value={loading ? "..." : stats.activeCustomers}
                    icon="✅"
                    color="border-green-500"
                />
                <StatCard
                    title="Checked In Today"
                    value={loading ? "..." : stats.checkedInToday}
                    icon="🏃‍♂️"
                    color="border-purple-500"
                />
                <StatCard
                    title="Expiring This Week"
                    value={loading ? "..." : stats.expiringThisWeek}
                    icon="⚠️"
                    color="border-yellow-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <QuickAction
                    title="Add New Customer"
                    description="Register a new gym member"
                    link="/customers/register"
                    icon="➕"
                    color="border-green-500"
                />
                <QuickAction
                    title="View All Customers"
                    description="Manage existing customers"
                    link="/customers"
                    icon="📋"
                    color="border-blue-500"
                />
                <QuickAction
                    title="Check-in System"
                    description="Quick customer check-in/out"
                    link="/checkin"
                    icon="🚪"
                    color="border-purple-500"
                />
                {role === 'admin' && (
                    <QuickAction
                        title="User Management"
                        description="Manage staff accounts"
                        link="/users"
                        icon="👨‍💼"
                        color="border-red-500"
                    />
                )}
                <QuickAction
                    title="Reports"
                    description="View analytics and reports"
                    link="/reports"
                    icon="📊"
                    color="border-yellow-500"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    {recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {recentActivity.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-lg mr-3">
                                        {activity.type === 'checkin' ? '🟢' : 
                                         activity.type === 'checkout' ? '🔴' : 
                                         activity.type === 'registration' ? '🆕' : '📝'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.description}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No recent activity</p>
                    )}
                </div>

                {/* Quick Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="font-medium">Gym Hours</span>
                            <span className="text-blue-600">6:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Current Capacity</span>
                            <span className="text-green-600">{stats.checkedInToday}/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}