"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = ['#22c55e', '#0e4429', '#facc15', '#6366f1', '#f87171'];

const defaultStats = {
  totalOrders: 0,
  totalRevenue: 0,
  newUsers: 0,
  soldItems: 0,
  salesByDay: [],
  orderStatusByMonth: [],
  topBrands: [],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats({ ...defaultStats, ...data });
      } catch (err) {
        setError("Failed to load dashboard stats");
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Prepare chart data
  const salesData = stats.salesByDay.length > 0
    ? stats.salesByDay.map(d => ({ name: d._id, sales: d.sales }))
    : [
      { name: 'Mon', sales: 5 },
      { name: 'Tue', sales: 15 },
      { name: 'Wed', sales: 12 },
      { name: 'Thu', sales: 18 },
      { name: 'Fri', sales: 14 },
      { name: 'Sat', sales: 8 },
      { name: 'Sun', sales: 10 },
    ];
  const orderStatusData = stats.orderStatusByMonth.length > 0
    ? stats.orderStatusByMonth.map(d => ({ name: d._id, orders: d.orders }))
    : [
      { name: 'Jan', orders: 8 },
      { name: 'Feb', orders: 6 },
      { name: 'Mar', orders: 14 },
      { name: 'Apr', orders: 10 },
      { name: 'May', orders: 12 },
      { name: 'Jun', orders: 9 },
    ];
  const pieData = stats.topBrands.length > 0 ? stats.topBrands : [
    { name: 'Apple', value: 20 },
    { name: 'Nokia', value: 30 },
    { name: 'Samsung', value: 25 },
    { name: 'Other', value: 25 },
  ];

  if (loading) return <div className="text-center py-20 text-lg">Loading dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sales Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 col-span-2">
          <h2 className="text-xl font-bold mb-4 text-green-700">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-700">Order Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-green-600 text-white rounded-xl p-6 shadow flex flex-col items-center">
          <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
          <div className="text-sm mt-1">Total Orders</div>
        </div>
        <div className="bg-yellow-400 text-gray-900 rounded-xl p-6 shadow flex flex-col items-center">
          <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm mt-1">Total Revenue</div>
        </div>
        <div className="bg-green-100 text-green-900 rounded-xl p-6 shadow flex flex-col items-center">
          <div className="text-2xl font-bold">{stats.newUsers.toLocaleString()}</div>
          <div className="text-sm mt-1">New Users</div>
        </div>
        <div className="bg-gray-800 text-white rounded-xl p-6 shadow flex flex-col items-center">
          <div className="text-2xl font-bold">{stats.soldItems.toLocaleString()}</div>
          <div className="text-sm mt-1">Sold Items</div>
        </div>
      </div>
      {/* Pie Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-green-700">Top Brands</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 