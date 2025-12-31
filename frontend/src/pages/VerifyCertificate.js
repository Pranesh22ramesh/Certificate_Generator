import React, { useState } from 'react';
import { certificateAPI } from '../services/api';
import { formatDate } from '../utils/helpers';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifyCertificate = () => {
    const [internId, setInternId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!internId.trim()) return;

        try {
            setLoading(true);
            setError('');
            setResult(null);

            const response = await certificateAPI.verify(internId.trim().toUpperCase());

            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.message || 'Verification failed');
            }
        } catch (err) {
            setError(err.message || 'Certificate not found or invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 pt-32 pb-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-30 -z-0"></div>
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px]"></div>

            <div className="container-custom relative z-10">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 backdrop-blur-md">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <span className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em]">Authenticity Ledger</span>
                    </div>
                    <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Verify <span className="text-gradient">Credentials</span></h1>
                    <p className="text-slate-400 text-lg">Enter a Certificate ID to verify the authenticity of a Twincord Technologies internship record.</p>
                </div>

                <div className="max-w-xl mx-auto mb-16">
                    <div className="dark-glass p-1 rounded-[2.5rem] shadow-2xl">
                        <form onSubmit={handleVerify} className="relative flex items-center p-2">
                            <input
                                type="text"
                                value={internId}
                                onChange={(e) => setInternId(e.target.value)}
                                placeholder="Enter ID (e.g., INT2023001)"
                                className="w-full bg-transparent border-none text-white px-6 py-4 rounded-3xl focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500 font-bold tracking-wider uppercase"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                className="absolute right-3 px-8 text-sm h-12 rounded-2xl shadow-indigo-500/20"
                            >
                                Verify Now
                            </Button>
                        </form>
                    </div>
                    {error && (
                        <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold animate-float">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                )}

                {result && (
                    <div className="max-w-3xl mx-auto animate-float">
                        <div className="glass-panel border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white tracking-tight">Verified Credential</h2>
                                        <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest mt-0.5">Official Record Found</p>
                                    </div>
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">Active Record</span>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900/40">
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Recipient Name</label>
                                        <p className="text-2xl font-bold text-white">{result.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Intern ID</label>
                                        <p className="text-xl font-mono font-bold text-slate-300">{result.internId}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Department</label>
                                        <p className="text-xl font-bold text-white">{result.department}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Completion Date</label>
                                        <p className="text-xl font-bold text-white">{formatDate(result.completionDate)}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Program Tenure</label>
                                        <p className="text-sm font-bold text-slate-300">
                                            {formatDate(result.startDate)} — {formatDate(result.endDate)}
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">This record is immutable and verified by Twincord.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border-t border-white/5 px-10 py-6 text-center">
                                <p className="text-xs text-slate-500 font-medium">Twincord Technologies Digital Verification System © {new Date().getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyCertificate;
