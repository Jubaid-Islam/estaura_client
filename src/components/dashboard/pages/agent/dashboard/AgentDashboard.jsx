// AgentDashboard.jsx
import React from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Building2, TrendingUp, DollarSign,
  MessageCircle, Handshake, Clock,
  ChevronRight, MapPin,
  Dot
} from "lucide-react";
import { useNavigate } from "react-router";
import useAgentStats from "../../../../../hooks/stats/useAgentStats";
import useUser from "../../../../../hooks/user/useUser";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
    <p className="text-sm font-bold text-gray-800 mb-4">{title}</p>
    {children}
  </div>
);

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useUser();
  const agentId = currentUser?._id?.toString();
  const { overview, revenue, assigned, proposal, dealsPerMonth, recentConvs, isLoading } = useAgentStats(agentId);

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

  // Revenue chart
  const revenueData = revenue?.labels?.map((l, i) => ({
    month: l.split(" ")[0],
    Revenue: revenue.revenue?.[i] || 0,
  })) || [];

  // Assigned per month
  const assignedData = assigned?.labels?.map((l, i) => ({
    month: l.split(" ")[0],
    Assigned: assigned.assigned?.[i] || 0,
  })) || [];

  // Proposal conversion donut
  const proposalData = proposal ? [
    { name: "Accepted", value: proposal.accepted || 0 },
    { name: "Pending", value: proposal.pending || 0 },
    { name: "Rejected", value: proposal.rejected || 0 },
    { name: "None", value: proposal.none || 0 },
  ].filter(d => d.value > 0) : [];

  // Deals per month
  const dealsData = dealsPerMonth?.labels?.map((l, i) => ({
    month: l.split(" ")[0],
    Deals: dealsPerMonth.deals?.[i] || 0,
  })) || [];

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Agent Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {currentUser?.name?.split(" ")[0] || "Agent"}
        </p>
      </div>

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
  {/* Revenue section */}
  <div className="border-b border-gray-100 pb-3 mb-3">
    <p className="text-xs text-gray-400 uppercase tracking-wide">Total revenue earned</p>
    <p className="text-2xl font-bold text-indigo-600">
      ${Number(overview?.revenueEarned || 0).toLocaleString()}
    </p>
  </div>

  {/* Stats list */}
  <div className="flex flex-col md:flex-row md:gap-6 space-y-1 md:space-y-0">

    {/* Active deals */}
    <div className="flex items-center ">
      <div className="w-7 h-7 flex items-center justify-center">
       <Dot size={30}  className="text-emerald-600" />
      </div>
      <span className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{overview?.activeDeals || 0}</span> active deals
      </span>
    </div>

    {/* Conversations */}
    <div className="flex items-center ">
      <div className="w-7 h-7 flex items-center justify-center">
        <Dot size={30} className="text-blue-600" />
      </div>
      <span className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{overview?.conversations || 0}</span> conversations
      </span>
    </div>

    {/* Properties */}
    <div className="flex items-center ">
      <div className="w-7 h-7 flex items-center justify-center">
        <Dot size={30}  className="text-indigo-600" />
      </div>
      <span className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{overview?.assignedProperties || 0}</span> properties
      </span>
    </div>
  </div>
</div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Personal Revenue Area */}
        <ChartCard title="Personal Revenue" className="md:col-span-4">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <Area type="monotone" dataKey="Revenue" stroke="#6366f1" fill="url(#revenueGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

     

        {/* Assigned Per Month Bar */}
        <ChartCard title="Properties Assigned This Period" className="md:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={assignedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <Bar dataKey="Assigned" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Deals Closed Per Month Line */}
        <ChartCard title="Deals Closed Per Month" className="md:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dealsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <Line type="monotone" dataKey="Deals" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Conversations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:col-span-2 ">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Recent Conversations</p>
            <button
              onClick={() => navigate("/dashboard/conversations")}
              className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 transition"
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          {recentConvs.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No conversations yet</div>
          ) : (
            <div className="space-y-3">
              {recentConvs.map((c) => (
                <div key={c._id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {c.propertyImage
                      ? <img src={cloudinaryUrl(c.propertyImage, { width: 80 })} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Building2 size={13} className="text-gray-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{c.propertyTitle}</p>
                    <p className="text-xs text-gray-400 truncate">{c.clientName}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(c.lastMessageAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

           {/* Proposal Conversion Donut */}
        <ChartCard title="Proposal Conversion" className="md:col-span-2">
          {proposalData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={proposalData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                    {proposalData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-2xl font-bold text-indigo-600">{proposal?.acceptanceRate || 0}%</span>
                <span className="text-xs text-gray-400">acceptance rate</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-3">
                {proposalData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }}></span>
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">No proposals yet</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default AgentDashboard;