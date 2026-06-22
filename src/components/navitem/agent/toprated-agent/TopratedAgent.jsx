import React from "react";
import { ArrowLeft, Dot, Handshake } from "lucide-react";
import { useNavigate } from "react-router";
import { useTopRatedAgents } from "../../../../hooks/deals/useTopRatedAgents"
const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-blue-100 text-blue-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];
const getAvatarColor = (id = "") => {
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const rankStyle = {
  0: " text-indigo-700",
  1: " text-Blue-600",
  2: " text-Gray-800",
};

export default function TopratedAgent() {
  const [agents, isLoading] = useTopRatedAgents();
  const navigate = useNavigate();



  const totalDeals = agents.reduce((s, a) => s + a.dealsClosed, 0);

  if (isLoading) return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
      </div>
      {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto mt-20">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-medium text-sm text-gray-600 hover:text-indigo-600 transition group mb-6"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-900">Top rated agents :</h1>
            <span className="text-lg font-medium px-2 py-0.5 text-indigo-600 ">
              {agents.length}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">Ranked by deals closed</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">



          {/* stats */}
          <div className="flex flex-row md:gap-6 ">

            <div className="flex items-center">
              <div className="w-7 h-7 flex items-center justify-center">
                <Dot size={30} className="text-indigo-600" />
              </div>
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{agents.length}</span> agents
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-7 h-7 flex items-center justify-center">
                <Dot size={30} className="text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{totalDeals}</span> deals closed
              </span>
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          {/* Desktop thead */}
          <div className="hidden md:grid grid-cols-[1fr_60px_100px_110px] px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            {['Agent', 'Rank', 'Deals closed', 'Latest deal'].map((h, i) => (
              <span key={h} className={`text-[11px] uppercase tracking-wider text-gray-400 font-medium ${i >= 2 ? 'text-right' : ''}`}>
                {h}
              </span>
            ))}
          </div>

          {agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                <Handshake size={18} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No agents yet</p>
            </div>
          ) : agents.map((agent, i) => (
            <div key={agent.agentId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">

              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[1fr_60px_100px_110px] items-center px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {agent.photo ? (
                    <img src={agent.photo} alt={agent.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0 ${getAvatarColor(agent.agentId)}`}>
                      {getInitials(agent.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{agent.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{agent.email}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-[11px] font-medium ${rankStyle[i] || 'bg-gray-100 text-gray-500'}`}>
                    {i + 1}
                  </span>
                </div>
                <p className="text-[13px] text-indigo-700 text-right">{agent.dealsClosed} deals</p>

                <p className="text-[12px] text-gray-400 text-right">{formatDate(agent.latestDeal)}</p>
              </div>

              {/* Mobile row */}
              <div className="md:hidden px-4 py-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center">
                    <p className="text-[13px] font-medium text-gray-500"> Rank :</p>
                    <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-[11px] font-medium ${rankStyle[i] || 'bg-gray-100 text-gray-500'}`}>
                      {i + 1}
                    </span>
                  </div>

                  <span className="text-[11px] text-gray-400">{formatDate(agent.latestDeal)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {agent.photo ? (
                    <img src={agent.photo} alt={agent.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0 ${getAvatarColor(agent.agentId)}`}>
                      {getInitials(agent.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{agent.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{agent.email}</p>

                  </div>
                  <p className="text-[11px] text-indigo-700 mt-0.5">{agent.dealsClosed} deals closed</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}