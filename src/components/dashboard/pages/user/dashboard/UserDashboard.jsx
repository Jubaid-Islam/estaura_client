// UserDashboard.jsx
import React from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Building2, DollarSign, Handshake, Check,
  Clock, ChevronRight, MapPin, CheckCircle,
  Circle, ArrowRight,
  Dot
} from "lucide-react";
import { useNavigate } from "react-router";
import useUserStats from "../../../../../hooks/stats/useUserStats"
import useUser from "../../../../../hooks/user/useUser";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";

const COLORS = ["#6366f1", "#10b981"];

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

// Deal progress steps
const PROPOSAL_STEPS = ["Closed", "Proposal", "Accepted", "Paid"];

const getStepIndex = (deal) => {
  if (deal.status === "completed") return 3;
  if (deal.proposalStatus === "accepted") return 2;
  if (deal.proposalStatus === "pending") return 1;
  return 0;
};


const stepState = (stepIndex, current) => {
  if (stepIndex < current) return 'done';
  if (stepIndex === current) return 'active';
  return 'todo';
};

const StepNode = ({ label, index, state }) => {
  const styles = {
    done: { sq: 'bg-gray-100/50 text-gray-600', lbl: 'text-gray-600 font-medium' },
    active: { sq: 'bg-indigo-600 text-white', lbl: 'text-indigo-700 font-medium' },
    todo: { sq: 'bg-gray-50 text-gray-400 border border-gray-200', lbl: 'text-gray-400' },
  };
  const s = styles[state];

  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div className={`w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px] font-medium ${s.sq}`}>
        {state === 'done'
          ? <Check size={12} strokeWidth={2.5} />
          : index + 1
        }
      </div>
      <span className={`text-[10px] whitespace-nowrap ${s.lbl}`}>{label}</span>
    </div>
  );
};

const Connector = ({ done }) => (
  <div className={`flex-1 h-[1.5px] mx-1 mb-[14px] ${done ? 'bg-purple-300' : 'bg-gray-200'}`} />
);

const statusConfig = {
  active: { label: 'Active', cls: 'bg-gray-100/80 text-teal-800' },
  pending: { label: 'Pending', cls: 'bg-gray-100/80 text-amber-800' },
  closed: { label: 'Closed', cls: 'bg-gray-100/80 text-teal-800' },
};

const DealProgressRow = ({ deal }) => {
  const current = getStepIndex(deal);
  const status = statusConfig[deal.status] || statusConfig.pending;

  return (
    <div className="py-3.5 border-b border-gray-100 last:border-0">

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[13px] font-medium text-gray-900 truncate flex-1 mr-3">
          {deal.propertyTitle}
        </p>
        <span className={`text-[11px] px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 ${status.cls}`}>
          {status.label}
        </span>
      </div>

      {/* Steps */}
      <div className="flex items-center">
        {PROPOSAL_STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <StepNode
              label={step}
              index={i}
              state={stepState(i, current)}
            />
            {i < PROPOSAL_STEPS.length - 1 && (
              <Connector done={i < current} />
            )}
          </React.Fragment>
        ))}
      </div>

    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useUser();
  const clientId = currentUser?._id?.toString();
  const { overview, payments, dealProgress, propType, submitted, isLoading } = useUserStats(clientId);

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

  // Payment history chart
  const paymentData = payments?.labels?.map((l, i) => ({
    month: l.split(" ")[0],
    Purchase: payments.buyPayments?.[i] || 0,
    Rent: payments.rentPayments?.[i] || 0,
  })) || [];

  // Property type donut
  const typeData = propType ? [
    { name: "Purchase", value: propType.buy || 0 },
    { name: "Rent", value: propType.rent || 0 },
  ].filter(d => d.value > 0) : [];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const statusColor = (status) => {
    if (status === "approved") return "bg-emerald-50 text-emerald-700";
    if (status === "pending") return "bg-amber-50 text-amber-700";
    if (status === "rejected") return "bg-red-50 text-red-600";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">

      {/* Header */}
      <div className="mb-6">
        <h1 className="hidden md:block text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {currentUser?.name?.split(" ")[0] || "there"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

        {/* Total Paid — primary highlight */}
        <div className="border-b border-gray-100 pb-3 mb-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total paid</p>
          <p className="text-2xl font-bold text-indigo-600">
            ${Number(overview?.totalPaid || 0).toLocaleString()}
          </p>
        </div>

        {/* Dot stats list */}
        <div className="flex flex-col md:flex-row md:gap-6 space-y-1 md:space-y-0">

          <div className="flex items-center">
            <div className="w-7 h-7 flex items-center justify-center">
              <Dot size={30} className="text-indigo-600" />
            </div>
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{overview?.activeDeals || 0}</span> active deals
            </span>
          </div>

          <div className="flex items-center">
            <div className="w-7 h-7 flex items-center justify-center">
              <Dot size={30} className="text-amber-600" />
            </div>
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{overview?.pendingProposals || 0}</span> pending proposals
            </span>
          </div>

          <div className="flex items-center">
            <div className="w-7 h-7 flex items-center justify-center">
              <Dot size={30} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{overview?.submittedProperties || 0}</span> submitted properties
            </span>
          </div>

        </div>
      </div>

      {/* Charts, Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Payment History Bar */}
        <ChartCard title="Payment History" className="md:col-span-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, undefined]} contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
              <Bar dataKey="Purchase" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="Rent" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Submitted Properties */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Submitted Properties</p>
          </div>
          {submitted.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No submissions yet</div>
          ) : (
            <div className="space-y-3">
              {submitted.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {p.images?.[0]
                      ? <img src={cloudinaryUrl(p.images[0], { width: 80 })} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Building2 size={14} className="text-gray-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              ))}
              <button
                onClick={() => navigate("/sell")}
                className="w-full flex items-center justify-center gap-1 py-2 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition"
              >
                Submit new <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Property Type Donut */}
        <ChartCard title="Deal Type Distribution" className="md:col-span-2">
          {typeData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-2xl font-bold text-indigo-600">{propType?.total || 0}</span>
                <span className="text-xs text-gray-400">total deals</span>
              </div>
              <div className="flex justify-center gap-4 mt-3">
                {typeData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }}></span>
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">No deals yet</div>
          )}
        </ChartCard>

        {/* Deal Progress */}
        <ChartCard title="Deal Progress" className="md:col-span-4">
          {dealProgress.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">No active deals</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {dealProgress.slice(0, 4).map(deal => (
                <DealProgressRow key={deal._id} deal={deal} />
              ))}
            </div>
          )}
        </ChartCard>


      </div>
    </div>
  );
};

export default UserDashboard;