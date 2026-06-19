import React, { useState } from 'react';
import { 
    Link2, RefreshCw, Activity, 
    ShieldCheck, Globe, Clock, Zap, Loader2, CheckCircle2, AlertCircle, 
    Database
} from 'lucide-react';
import useConnectApi from "../../../../../hooks/integration/useConnectApi";
import useDisconnectApi from "../../../../../hooks/integration/useDisconnectApi";
import useSyncApiData from "../../../../../hooks/integration/useSyncApiData";
import useApiStatus from "../../../../../hooks/integration/useApiStatusjsx";
import Swal from 'sweetalert2';

export default function ConnectApi() {
    const { data: apis = [], isLoading, refetch } = useApiStatus();
    const { mutateAsync: connectApiMutation, isPending: isConnecting } = useConnectApi();
    const { mutateAsync: syncApiData, isPending: isSyncing } = useSyncApiData();
    const { mutateAsync: disconnectApi } = useDisconnectApi();

    const [isAutoSyncing, setIsAutoSyncing] = useState(false);
    const api = apis[0];
    console.log(api)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const apiData = {
            name: form.name.value,
            endpoint: form.endpoint.value
        };

        try {
            // conncent 
            const result = await connectApiMutation(apiData);
            const newId = result.insertedId;
            
            if (newId) {
                
                setIsAutoSyncing(true);
                await syncApiData(newId);
                await refetch();
                setIsAutoSyncing(false);
                
                Swal.fire({
                    icon: 'success',
                    title: 'System Online',
                    text: 'API connected and initial sync completed!',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            setIsAutoSyncing(false);
            Swal.fire('Error', error.response?.data?.message || "Connection failed", 'error');
        }
    };

    const handleManualSync = async (id) => {
        try {
            const result = await syncApiData(id);
            Swal.fire({
                icon: 'success',
                title: 'Synced!',
                text: `${result?.inserted ?? 0} new records imported.`,
                timer: 1000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Sync Failed', error.response?.data?.message || 'Could not refresh data', 'error');
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            
            {/* Status Header  */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${api ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        <Activity size={20} className={api ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Connection Engine</h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {api ? `Syncing with ${api.name}` : 'No active data source'}
                        </p>
                    </div>
                </div>
                {api && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                        Operational
                    </span>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                
                {/*  Configuration Card  */}
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    {isAutoSyncing && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                            <Loader2 className="animate-spin text-indigo-600 mb-3" size={32} />
                            <p className="font-bold text-slate-800">Initializing Auto-Sync</p>
                            <p className="text-xs text-slate-500">Please wait while we fetch your first batch of data...</p>
                        </div>
                    )}

                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Globe size={16} /> API Settings
                    </h3>

                    {!api ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="group">
                                <label className="text-[11px] font-bold text-slate-500 ml-1 mb-1 block uppercase">Provider Name</label>
                                <input name="name" placeholder="e.g. Stripe Revenue" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required />
                            </div>
                            <div className="group">
                                <label className="text-[11px] font-bold text-slate-500 ml-1 mb-1 block uppercase">Endpoint Gateway</label>
                                <input name="endpoint" placeholder="https://api.service.com/v1" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required />
                            </div>
                            <button disabled={isConnecting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                                {isConnecting ? <Loader2 className="animate-spin" size={20}/> : <Zap size={15} fill="currentColor"/>}
                                Connect & Auto-Sync
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Source</p>
                                <p className="text-xl font-bold text-indigo-600">{api.name}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Endpoint URL</p>
                                <code className="text-[11px] text-slate-600 break-all leading-relaxed">{api.endpoint}</code>
                            </div>
                            <button onClick={() => disconnectApi(api._id).then(refetch)} className="w-full py-3 text-rose-600 bg-rose-100 font-bold text-sm hover:bg-rose-50 rounded-xl transition-colors">
                                Disconennct Api
                            </button>
                        </div>
                    )}
                </div>

                {/*  Metrics and Health  */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* Synced Data Count */}
                        <div className="p-6 rounded-3xl relative overflow-hidden border border-slate-200 shadow-sm">
                            <Database className="absolute -right-4 -bottom-4 text-white/5" size={120} />
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Synced</p>
                            <h4 className="text-4xl text-indigo-600 font-bold">{api?.syncedCount || 0}</h4>
                            <div className="mt-4 flex items-center gap-2 text-[11px] text-indigo-500 bg-white/5 w-fit px-3 py-1 rounded-full">
                                <CheckCircle2 size={12} /> Database Verified
                            </div>
                        </div>

                        {/* Last Sync Info */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Last Sync</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {api?.lastSync ? new Date(api.lastSync).toLocaleTimeString() : 'Never'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleManualSync(api._id)}
                                    disabled={!api || isSyncing}
                                    className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                >
                                    <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
                                </button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                                <Clock className="text-slate-300" size={14} />
                                <span className="text-xs text-slate-400">Next scheduled check: <span className="text-slate-600 font-semibold">Manual only</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Health Metrics */}
                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Latency</p>
                            <p className="text-sm font-bold text-indigo-600">24ms</p>
                        </div>
                        <div className="text-center border-x border-indigo-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Uptime</p>
                            <p className="text-sm font-bold text-indigo-600">100%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Security</p>
                            <p className="text-sm font-bold text-indigo-600">SSL v3</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}