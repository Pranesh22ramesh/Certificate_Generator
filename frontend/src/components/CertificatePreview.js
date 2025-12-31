import React from 'react';
import { formatDate } from '../utils/helpers';

const CertificatePreview = ({ intern }) => {
    if (!intern) return null;

    const styles = {
        page: {
            width: '100%',
            aspectRatio: '1.414 / 1', // A4 Landscape ratio
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative',
            backgroundColor: '#fff',
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            color: '#0f172a',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '20px solid transparent',
            borderImage: 'linear-gradient(to bottom right, #1e3a8a, #3b82f6, #f59e0b) 1',
        },
        watermark: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-30deg)',
            fontSize: '120px',
            fontWeight: '900',
            color: 'rgba(30, 58, 138, 0.03)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 0,
            letterSpacing: '20px'
        },
        seal: {
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 8px rgba(245, 158, 11, 0.2), inset 0 0 0 2px rgba(255, 255, 255, 0.5)',
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
        }
    };

    return (
        <div className="w-full overflow-x-auto p-8 flex justify-center bg-slate-100 rounded-3xl shadow-inner scrollbar-hide">
            <div style={styles.page} className="certificate-node relative select-none transform hover:scale-[1.02] transition-all duration-700 ease-out group">

                {/* Background Patterns */}
                <div style={styles.watermark}>TWINCORD</div>
                <div className="absolute inset-0 border-[2px] border-indigo-100 m-4 pointer-events-none"></div>

                {/* Header */}
                <div className="w-full flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-indigo-900 to-blue-800 text-white flex items-center justify-center rounded-2xl font-extrabold text-2xl shadow-xl border border-white/20">TC</div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase leading-none">Twincord</h2>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Technologies & Innovation</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Credential No.</p>
                        <p className="text-sm font-mono font-bold text-indigo-600 mt-1">CERT-{intern.internId}-{new Date().getFullYear()}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full text-center relative z-10 py-12">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">
                        Certificate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-indigo-600">of Completion</span>
                    </h1>

                    <p className="text-lg text-slate-500 font-medium mb-12 italic">This prestigious award is proudly presented to</p>

                    <div className="relative inline-block mb-12">
                        <h3 className="text-5xl md:text-7xl font-black text-indigo-950 px-12 relative z-10 leading-tight">
                            {intern.name}
                        </h3>
                        <div className="absolute bottom-2 left-0 w-full h-4 bg-indigo-50 -z-0"></div>
                    </div>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                        for successfully fulfilling all requirements and demonstrating exceptional proficiency during the
                        <span className="text-indigo-900 font-bold px-2 underline decoration-amber-500 decoration-4 underline-offset-4">{intern.department}</span>
                        Internship program from <span className="text-slate-900 font-bold">{formatDate(intern.startDate)}</span> to <span className="text-slate-900 font-bold">{formatDate(intern.endDate)}</span>.
                    </p>
                </div>

                {/* Global Seal */}
                <div style={styles.seal} className="animate-pulse">
                    <div className="text-white flex flex-col items-center">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[8px] font-black uppercase tracking-tighter">Verified</span>
                    </div>
                </div>

                {/* Footer / Signatures */}
                <div className="w-full flex justify-between items-end px-12 relative z-10 mt-12">
                    <div className="text-center w-64 group-hover:-translate-y-1 transition-transform">
                        <div className="mb-4 h-12 flex items-center justify-center italic font-serif text-2xl text-slate-400 opacity-50">Pranesh</div>
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-2"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Director of Operations</p>
                    </div>

                    <div className="text-center w-64 group-hover:-translate-y-1 transition-transform">
                        <div className="mb-4 h-12 flex items-center justify-center italic font-serif text-2xl text-slate-400 opacity-50">HR Division</div>
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-2"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Human Resources</p>
                    </div>
                </div>

                {/* Issue Date */}
                <p className="absolute bottom-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                    Issued on {formatDate(intern.completionDate || new Date())} • Verified Corporate Document
                </p>

            </div>
        </div>
    );
};

export default CertificatePreview;

