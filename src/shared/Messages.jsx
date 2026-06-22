import { Dot, Send } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router';
import useUsers from '../hooks/user/useUser';
import { useConversations } from '../hooks/conversation/useConversations';

const Messages = () => {
    const { data: currentUser } = useUsers();
    const role = currentUser?.role;
    const userId = currentUser?._id?.toString();
    const { conversations } = useConversations(userId, role);


    if (!role) return null;

    const path =
        role === 'user' || role === 'admin' ?
            '/dashboard/my-conversations' : '/dashboard/conversations'

    const unreadCount = conversations.reduce(
        (total, conv) => total + (conv?.unreadCount || 0),
        0
    );

    return (
        <div className='pr-2 pt-1'>

            <NavLink to={path} className="relative inline-flex">
                <Send size={18} className="text-gray-600" />

                {unreadCount > 0 && (
                    <Dot
                        size={40}
                        className="absolute -bottom-4 -right-5 text-indigo-500 animate-pulse"
                    />
                )}
            </NavLink>

        </div>
    );
};

export default Messages;
