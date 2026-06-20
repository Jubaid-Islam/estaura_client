import React, { useState } from "react";
import { MessageSquare, ArrowLeft, Search, X } from "lucide-react";
import useUser from "../../../../../hooks/user/useUser";
import useConversations from "../../../../../hooks/conversation/useConversations";
import ChatWindow from "../../../../chat/ChatWindow";

const formatTime = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const getInitials = (name) => {
  if (!name) return "C";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-600",
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-orange-100 text-orange-600",
];
const getAvatarColor = (id = "") => {
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const AgentConversations = () => {
  const { data: currentUser } = useUser();
  const agentId = currentUser?._id?.toString();

  const { conversations, isLoading } = useConversations(agentId, "agent");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showChat, setShowChat] = useState(false);

  const filtered = conversations.filter((c) =>
    !searchTerm.trim() ||
    c.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (conv) => {
    setSelectedConversation(conv);
    setShowChat(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl border border-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-5 md:p-6 lg:p-8 bg-gradient-to-br  from-gray-50 to-gray-100  dm-sans">

      <div className="pb-6">

        {showChat && (
          <button
            onClick={() => setShowChat(false)}
            className="md:hidden flex items-center gap-1.5 px-1 pb-2 font-medium text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={13} /> Back 
          </button>
        )}
      </div>

      {/* Split View */}
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        style={{ height: "calc(100vh - 210px)", minHeight: "500px" }}
      >
        <div className="flex h-full min-h-0">

          {/* Left — List */}
          <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-100 flex flex-col ${showChat ? "hidden md:flex" : "flex"}`}>

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare size={20} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No conversations</p>
                  <p className="text-xs text-gray-400 mt-1">Client messages will appear here.</p>
                </div>
              ) : (
                filtered.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => handleSelect(conv)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-indigo-50/40 transition border-b border-gray-50 text-left ${selectedConversation?._id === conv._id
                        ? "bg-indigo-50 border-l-2 border-l-indigo-500"
                        : ""
                      }`}
                  >
                    {/* Client Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${getAvatarColor(conv.clientId)}`}>
                      {getInitials(conv.clientName)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {conv.clientName || "Client"}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.propertyTitle}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right — Chat Window  */}
          <div className={`flex-1 flex flex-col min-w-0 ${showChat ? "flex" : "hidden md:flex"}`}>
            <ChatWindow
              conversation={selectedConversation}
              currentUserId={agentId}
              currentUserRole="agent"
              currentUserName={currentUser?.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConversations;