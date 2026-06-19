import React from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { Building2, Users, TrendingUp, Clock, UserCheck, DollarSign, MapPin, ChevronRight, Dot } from "lucide-react";
import { useNavigate } from "react-router";
import useAdminStats from "../../../../../hooks/stats/useAdminStats";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
    <p className="text-sm font-bold text-gray-800 mb-4">{title}</p>
    {children}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { overview, revenue, propertyStatus, deals, pendingList, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse dm-sans">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Revenue chart data
  const revenueData = revenue?.labels?.map((l, i) => ({
    month: l.split(" ")[0],
    Sales: revenue.buyRevenue?.[i] || 0,
    Rent:  revenue.rentRevenue?.[i] || 0,
  })) || [];

  // Property status pie
  const statusData = propertyStatus ? [
    { name: "Available", value: propertyStatus.available || 0 },
    { name: "Assigned",  value: propertyStatus.assigned  || 0 },
    { name: "Sold",      value: propertyStatus.sold      || 0 },
    { name: "Rented",    value: propertyStatus.rented    || 0 },
    { name: "Pending",   value: propertyStatus.pending   || 0 },
  ].filter(d => d.value > 0) : [];

  // Deals per month
  const dealsData = deals?.labels?.map((l, i) => ({
    month: l.split(" ")[0],
    Deals: deals.dealsPerMonth?.[i] || 0,
  })) || [];

  // Agent performance
  const agentData = (deals?.agentPerformance || []).slice(0, 6).map(a => ({
    name:  a.name?.split(" ")[0] || "Agent",
    Deals: a.deals,
  }));

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and performance metrics</p>
      </div>

    {/* Quick Stats */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

  {/* Total Revenue — primary highlight */}
  <div className="border-b border-gray-100 pb-3 mb-3">
    <p className="text-xs text-gray-400 uppercase tracking-wide">Total revenue</p>
    <p className="text-2xl font-bold text-indigo-600">
      ${Number(overview?.totalRevenue || 0).toLocaleString()}
    </p>
  </div>

  {/* Dot stats list */}
  <div className="flex flex-col md:flex-row md:gap-6 space-y-3 md:space-y-0">

    <div className="flex items-center">
      <div className="w-7 h-7 flex items-center justify-center">
        <Dot size={30} className="text-indigo-600" />
      </div>
      <span className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{overview?.totalProperties || 0}</span> properties
      </span>
    </div>

    <div className="flex items-center">
      <div className="w-7 h-7 flex items-center justify-center">
        <Dot size={30} className="text-emerald-600" />
      </div>
      <span className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{overview?.totalUsers || 0}</span> users
      </span>
    </div>

    <div className="flex items-center">
      <div className="w-7 h-7 flex items-center justify-center">  
        <Dot size={30} className="text-purple-600" />
      </div>
      <span className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{overview?.totalAgents || 0}</span> agents
      </span>
    </div>

  </div>
</div>
      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Revenue Area Chart */}
        <ChartCard title="Monthly Revenue (Sales & Rent)" className="md:col-span-4">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, undefined]} contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="Sales" stroke="#6366f1" fill="url(#salesGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Rent"  stroke="#10b981" fill="url(#rentGrad)"  strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Property Status Donut */}
        <ChartCard title="Property Status Distribution" className="md:col-span-2">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">No data yet</div>
          )}
        </ChartCard>

        {/* Deals Per Month Line Chart */}
        <ChartCard title="Deals Closed Per Month" className="md:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dealsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <Line type="monotone" dataKey="Deals" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pending Properties List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Pending Review</p>
            {overview?.pendingProperties > 0 && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                {overview.pendingProperties}
              </span>
            )}
          </div>
          {pendingList.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No pending properties</div>
          ) : (
            <div className="space-y-3">
              {pendingList.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {p.images?.[0]
                      ? <img src={cloudinaryUrl(p.images[0], { width: 80 })} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Building2 size={14} className="text-gray-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin size={9} /> {p.city}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate("/dashboard/pending-properties")}
                className="w-full flex items-center justify-center gap-1 py-2 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition"
              >
                View all <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

               {/* Agent Performance Horizontal Bar */}
        <ChartCard title="Agent Performance" className="md:col-span-2">
          {agentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={agentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
                <Bar dataKey="Deals" fill="#6366f1" radius={[0, 6, 6, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">No agent data yet</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboard;