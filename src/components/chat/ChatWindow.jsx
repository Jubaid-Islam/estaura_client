import React, { useState, useEffect, useRef } from "react";
import { Send, X, User, Mail, ChevronDown, Info, MapPin, Tag, DollarSign, Building2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useMessages from "../../hooks/messages/useMessages";
import useSendMessage from "../../hooks/messages/useSendMessage";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { markMessagesRead, updateConversationDealStatus } from "../../api/messageApi";
import { updateDealStatus as updatePropertyDealStatus } from "../../api/PropertyApi";
import { deleteConversation } from "../../api/conversationApi";
import { cloudinaryUrl } from "../../hooks/cloudniaryUrl";

const DEAL_STATUSES = [
  { value: "interested",      label: "Interested",      color: "text-blue-600 bg-gray-50" },
  { value: "visit_scheduled", label: "Visit Scheduled", color: "text-purple-600 bg-gray-50" },
  { value: "negotiating",     label: "Negotiating",     color: "text-yellow-600 bg-gray-50" },
  { value: "deal_closed",     label: "Deal Closed",     color: "text-emerald-600 bg-gray-50" },
];

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const getInitials = (name) => {
  if (!name) return "?";
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

//  Property Card
const PropertyHoverCard = ({ conversation }) => (
  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden pointer-events-none">
    <div className="h-36 bg-gray-100 overflow-hidden relative">
      {conversation.propertyImage ? (
        <img src={cloudinaryUrl(conversation.propertyImage, { width: 400 })} alt={conversation.propertyTitle} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"><Building2 size={28} className="text-gray-300" /></div>
      )}
      {conversation.listingType && (
        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
          conversation.listingType === "rent" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {conversation.listingType}
        </span>
      )}
    </div>
    <div className="p-4 space-y-2">
      <p className="text-sm font-bold text-gray-900 line-clamp-1">{conversation.propertyTitle}</p>
      {conversation.propertyCity && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin size={11} className="text-gray-400" /> {conversation.propertyCity}
        </p>
      )}
      <div className="flex items-center justify-between pt-1">
        {conversation.propertyPrice ? (
          <p className="text-sm font-bold text-indigo-600 flex items-center gap-1">
            <DollarSign size={13} /> {Number(conversation.propertyPrice).toLocaleString()}
          </p>
        ) : null}
        {conversation.propertyType && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Tag size={11} /> {conversation.propertyType}
          </p>
        )}
      </div>
    </div>
  </div>
);


const ChatWindow = ({ conversation, currentUserId, currentUserRole, currentUserName, onDealStatusChange, onConversationDeleted }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDealDropdown, setShowDealDropdown] = useState(false);
  const [showPropertyCard, setShowPropertyCard] = useState(false);
  const [currentDealStatus, setCurrentDealStatus] = useState(conversation?.dealStatus || null);
  const [isUpdatingDeal, setIsUpdatingDeal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const infoButtonRef = useRef(null);
  const infoModalRef = useRef(null);
  const dealDropdownRef = useRef(null);
  const propertyBtnRef = useRef(null);
  const bottomRef = useRef(null);

  const { messages, isLoading } = useMessages(conversation?._id?.toString());
  const { sendMessage, isPending } = useSendMessage(conversation?._id?.toString());

  const recipientId = currentUserRole === "agent" ? conversation?.clientEmail : conversation?.agentId;
  const recipientRole = currentUserRole === "agent" ? "user" : "agent";
  const headerName = currentUserRole === "agent" ? conversation?.clientName : conversation?.agentName || "Agent";
  const headerEmail = currentUserRole === "agent" ? conversation?.clientEmail : null;
  const headerId = currentUserRole === "agent" ? conversation?.clientId : conversation?.agentId;
  const activeDealStatus = DEAL_STATUSES.find(d => d.value === currentDealStatus);

  useEffect(() => {
    setCurrentDealStatus(conversation?.dealStatus || null);
  }, [conversation?._id, conversation?.dealStatus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversation?._id || !currentUserId) return;
    markMessagesRead(conversation._id.toString(), currentUserId, axiosSecure).then(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
  }, [conversation?._id, currentUserId, axiosSecure, queryClient]);

  useEffect(() => {
    const handleClick = (e) => {
      if (infoModalRef.current && !infoModalRef.current.contains(e.target) &&
          infoButtonRef.current && !infoButtonRef.current.contains(e.target)) {
        setShowInfoModal(false);
      }
      if (dealDropdownRef.current && !dealDropdownRef.current.contains(e.target)) {
        setShowDealDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDealStatusChange = async (status) => {
    setIsUpdatingDeal(true);
    setShowDealDropdown(false);
    try {
      await updateConversationDealStatus(conversation._id.toString(), {
        dealStatus:    status,
        propertyId:    conversation.propertyId,
        propertyTitle: conversation.propertyTitle,
        propertyImage: conversation.propertyImage,
        propertyCity:  conversation.propertyCity  || "",
        propertyType:  conversation.propertyType  || "",
        propertyPrice: conversation.propertyPrice || 0,
        listingType:   conversation.listingType   || "buy",
        agentId:       conversation.agentId,
        clientId:      conversation.clientId,
        clientEmail:   conversation.clientEmail,
      }, axiosSecure);

      if (conversation.propertyId) {
        await updatePropertyDealStatus(conversation.propertyId, status, axiosSecure);
      }

      setCurrentDealStatus(status);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["agentDeals"] });
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      if (onDealStatusChange) onDealStatusChange(status);
    } catch {
      // silent
    } finally {
      setIsUpdatingDeal(false);
    }
  };

  // delete conversation 
  const handleDeleteConversation = async () => {
    const result = await Swal.fire({
      title: "Delete Conversation?",
      text: "All messages will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      customClass: { popup: "rounded-2xl" },
    });
    if (!result.isConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteConversation(conversation._id.toString(), axiosSecure);
      setShowInfoModal(false);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false, customClass: { popup: "rounded-2xl" } });
      if (onConversationDeleted) onConversationDeleted();
    } catch {
      Swal.fire("Error", "Failed to delete conversation.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || isPending) return;
    try {
      await sendMessage({
        senderId:      currentUserId,
        senderRole:    currentUserRole,
        senderName:    currentUserName,
        text:          text.trim(),
        recipientId,
        recipientRole,
        propertyId:    conversation.propertyId,
        propertyTitle: conversation.propertyTitle,
        propertyImage: conversation.propertyImage,
      });
      setText("");
    } catch {
      // silent
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-gray-300">?</div>
          <p className="text-sm font-medium text-gray-500">Select a conversation</p>
          <p className="text-xs text-gray-400 mt-1">Choose from the list to start chatting</p>
        </div>
      </div>
    );
  }

  const groupedMessages = messages.reduce((groups, msg) => {
    const label = formatDate(msg.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white flex-shrink-0">

        {/* Avatar */}
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${getAvatarColor(headerId)}`}>
          {getInitials(headerName)}
        </div>

        {/* Name and Property */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{headerName}</p>
          <div className="relative inline-block max-w-full" ref={propertyBtnRef}>
            <button
              onClick={() => conversation.propertyId && navigate(`/property/${conversation.propertyId}`)}
              onMouseEnter={() => setShowPropertyCard(true)}
              onMouseLeave={() => setShowPropertyCard(false)}
              className="text-xs text-gray-400 truncate hover:text-indigo-500 hover:underline transition text-left max-w-full block"
            >
              {conversation.propertyTitle}
            </button>
            {showPropertyCard && <PropertyHoverCard conversation={conversation} />}
          </div>
        </div>

        {/* Deal Status — agent */}
        {currentUserRole === "agent" ? (
          <div className="relative" ref={dealDropdownRef}>
            <button
              onClick={() => setShowDealDropdown(p => !p)}
              disabled={isUpdatingDeal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                activeDealStatus
                  ? `${activeDealStatus.color} border-transparent`
                  : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
              } disabled:opacity-50`}
            >
              {isUpdatingDeal
                ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : activeDealStatus?.label || "Deal Status"
              }
              <ChevronDown size={11} />
            </button>

            {showDealDropdown && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                {DEAL_STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleDealStatusChange(s.value)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition ${
                      currentDealStatus === s.value ? s.color : "text-gray-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          activeDealStatus && (
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeDealStatus.color}`}>
              {activeDealStatus.label}
            </span>
          )
        )}

        {/* Info button */}
        <div className="relative flex-shrink-0">
          <button
            ref={infoButtonRef}
            onClick={() => setShowInfoModal(p => !p)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 transition"
          >
            <Info size={16} />
          </button>

          {showInfoModal && (
            <div
              ref={infoModalRef}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-30 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {currentUserRole === "agent" ? "Client Info" : "Agent Info"}
                </p>
                <button onClick={() => setShowInfoModal(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <X size={13} />
                </button>
              </div>

              {/* User Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0 ${getAvatarColor(headerId)}`}>
                    {getInitials(headerName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{headerName}</p>
                    {headerEmail && (
                      <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                        <Mail size={10} /> {headerEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
                  <User size={12} className="text-gray-400" />
                  <span className="capitalize font-medium">
                    {currentUserRole === "agent" ? "Client" : "Agent"}
                  </span>
                </div>
              </div>

              {/* Delete Conversation */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleDeleteConversation}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-red-500 hover:text-red-700 rounded-xl text-xs font-semibold transition disabled:opacity-60"
                >
                  {isDeleting
                    ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : <Trash2 size={13} />
                  }
                  {isDeleting ? "Deleting..." : "Delete Conversation"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 bg-gray-50 min-h-0">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className="h-10 w-48 bg-gray-200 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
              <div key={dateLabel}>
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium px-2 flex-shrink-0">{dateLabel}</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="space-y-2">
                  {msgs.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div key={msg._id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? "bg-indigo-600 text-white rounded-br-sm"
                              : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm"
                          }`}
                          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                            {formatTime(msg.createdAt)}
                            {isMe && <span className="ml-1">{msg.isRead ? "✓✓" : "✓"}</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 min-w-0 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition overflow-y-auto"
            style={{ minHeight: "42px", maxHeight: "112px" }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || isPending}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isPending
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send size={16} />
            }
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">Press Enter to send</p>
      </div>
    </div>
  );
};

export default ChatWindow;