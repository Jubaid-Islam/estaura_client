import { BarChart3, Check, ShieldCheck, Trash2, User, Users, X } from 'lucide-react';

const ActionBtn = ({ user, onRoleChange, onDelete }) => {
    const modalId = `modal_role_${user._id}`;

    const roles = [
        // { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-indigo-600', desc: 'Full system access' },
        { id: 'agent', label: 'Agent', icon: Users, color: 'text-sky-600', desc: 'View reports & data' },
        { id: 'user', label: 'User', icon: User, color: 'text-slate-600', desc: 'General access' },
    ];

    return (
        <div className="flex items-center justify-end gap-2">

            {/* modal open btn */}
            <button
                onClick={() => document.getElementById(modalId).showModal()}
                className="p-2 text-slate-400 transition-all rounded-lg hover:bg-indigo-50 hover:text-indigo-600 tooltip tooltip-left"
                data-tip="Change Role"
            >
                <ShieldCheck size={18} strokeWidth={2} />
            </button>

            {/* modal structure */}
            <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0  overflow-hidden rounded-2xl border border-slate-100 shadow-2xl">


                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Assign Role</h3>
                        <form method="dialog">
                            <button className="hover:bg-gray-200 p-1 rounded-xl"><X size={20} /></button>
                        </form>
                    </div>

                    <div className="p-6">
                        <p className="text-sm text-slate-500 mb-4">
                            Select a role for <span className="font-semibold text-slate-900">{user.name}</span>
                        </p>

                        <div className="grid gap-3">
                            {roles.map((role) => {
                                const isActive = user.role === role.id || (!user.role && role.id === 'user');
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => {
                                            onRoleChange(user, role.id);
                                            document.getElementById(modalId).close();
                                        }}
                                        disabled={isActive}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${isActive
                                            ? 'bg-indigo-50 border-indigo-200 cursor-default'
                                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                                                <role.icon size={20} className={role.color} />
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{role.label}</p>
                                                <p className="text-xs text-slate-400">{role.desc}</p>
                                            </div>
                                        </div>
                                        {isActive && <Check size={18} className="text-indigo-600" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* close btn */}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* delete btn */}
            <button
                onClick={() => onDelete(user._id)}
                className="p-2 text-slate-400 transition-colors rounded-lg hover:bg-rose-50 hover:text-rose-600 tooltip tooltip-left"
                data-tip="Delete User"
            >
                <Trash2 size={18} strokeWidth={2} />
            </button>

        </div>
    );
};

export default ActionBtn;