import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { userAPI, certificateAPI } from '../services/api';
import { formatDate } from '../utils/helpers';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import CertificatePreview from '../components/CertificatePreview';
import Confetti from '../components/Confetti';

const UserCertificate = () => {
  const { setError, clearError } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [intern, setIntern] = useState(null);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      clearError();

      const response = await userAPI.getProfile();

      if (response.success) {
        setIntern(response.intern);
        if (response.intern.status === 'Completed') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000); // Stop confetti after 8 seconds
        }
      } else {
        setError(response.message || 'Failed to load your profile');
      }
    } catch (error) {
      console.error('Load profile error:', error);
      setError(error.message || 'Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!intern) return;

    try {
      setDownloadingCertificate(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      const blob = await certificateAPI.download(intern.internId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${intern.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError(error.message || 'Failed to download certificate');
    } finally {
      setDownloadingCertificate(false);
    }
  };

  const shareOnLinkedIn = () => {
    const text = `Extremely proud to announce that I have completed my internship at Twincord Technologies! 🚀 Ready for the next chapter. #Career #Internship #Twincord`;
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="min-h-screen bg-slate-900 pt-32 flex justify-center items-center"><LoadingSpinner /></div>;
  if (!intern) return <div className="min-h-screen bg-slate-900 pt-32 text-center text-white"><div className="container-custom"><Alert type="error" message="Profile not found." /></div></div>;

  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-20 relative overflow-hidden text-white font-sans">
      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Confetti active={showConfetti} />

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">Intern Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Honoring Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Journey</span>
            </h1>
            <p className="text-slate-400 mt-3 text-lg font-medium">Your accomplishments at Twincord Technologies, officially recognized.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {intern.status === 'Completed' && (
              <Button
                variant="primary"
                onClick={handleDownloadCertificate}
                loading={downloadingCertificate}
                disabled={!intern.certificateAccessEnabled}
                className="px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transform hover:scale-105 transition-all text-base bg-gradient-to-r from-sky-500 to-indigo-600 border-none"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download This Certificate
              </Button>
            )}

            {intern.offerLetterGenerated && (
              <Button
                variant="secondary"
                onClick={() => {
                  alert("Offer Letter download is not yet implemented on the server.");
                }}
                className="px-8 py-4 rounded-2xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-white shadow-lg transform hover:scale-105 transition-all text-base"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download Offer Letter
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Info Card & Certificate List */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Active Record Details */}
            <div className="card bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Selected Internship</h3>
                <Badge variant={intern.status === 'Completed' ? 'primary' : 'success'}>{intern.status}</Badge>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    {intern.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{intern.name}</h4>
                    <p className="text-sm font-mono text-sky-400 font-medium">{intern.internId}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <span className="text-xs font-bold text-slate-400 uppercase">Department</span>
                    <span className="text-sm font-bold text-slate-200">{intern.department}</span>
                  </div>
                  <div className="flex justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <span className="text-xs font-bold text-slate-400 uppercase">Start Date</span>
                    <span className="text-sm font-bold text-slate-200">{formatDate(intern.startDate)}</span>
                  </div>
                  <div className="flex justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <span className="text-xs font-bold text-slate-400 uppercase">End Date</span>
                    <span className="text-sm font-bold text-slate-200">{formatDate(intern.endDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Vault List */}
            <div className="card bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex items-center gap-3">
                <div className="h-6 w-6 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v5a2 2 0 012 2z" /></svg>
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Your Certificate Vault</h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {intern.certificates && intern.certificates.map((cert) => (
                  <div
                    key={cert.internId}
                    onClick={() => setIntern(prev => ({ ...prev, ...cert }))}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer ${intern.internId === cert.internId
                        ? 'bg-sky-500/10 border-sky-500/50 ring-1 ring-sky-500/20'
                        : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">{cert.department}</span>
                      <Badge variant={cert.status === 'Completed' ? 'primary' : 'success'} className="px-2 py-0 text-[8px] uppercase">{cert.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{cert.internId}</p>
                      <svg className={`w-4 h-4 transition-transform ${intern.internId === cert.internId ? 'text-sky-400 translate-x-1' : 'text-slate-600 group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-700">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Share Achievement</p>
              <button
                onClick={shareOnLinkedIn}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-600 bg-slate-800 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all font-bold text-slate-300 group"
              >
                <svg className="h-5 w-5 text-[#0077b5] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                Add to LinkedIn Profile
              </button>
            </div>
          </div>

          {/* Right: Certificate Preview */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black text-white tracking-tight">Official Preview</h3>
              {intern.status === 'Completed' && (
                <span className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Verified & Ready
                </span>
              )}
            </div>

            <div className="relative group perspective-1000">
              {intern.status === 'Completed' ? (
                <>
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative rounded-[30px] overflow-hidden shadow-2xl transition-transform duration-500 hover:rotate-x-2">
                    <CertificatePreview intern={intern} />
                  </div>
                </>
              ) : (
                <div className="aspect-[1.414/1] bg-slate-800/50 backdrop-blur-sm rounded-[32px] border-4 border-dashed border-slate-700 flex flex-col items-center justify-center p-12 text-center group-hover:border-slate-600 transition-all">
                  <div className="h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Certificate Locked</h4>
                  <p className="text-slate-400 max-w-sm font-medium text-lg">This document is being finalized for {intern.internId}. It will be released automatically upon the completion of your evaluation process.</p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-amber-900/20 border border-amber-500/20 flex items-start gap-4 backdrop-blur-sm">
              <div className="h-10 w-10 shrink-0 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h5 className="font-bold text-amber-500 uppercase text-xs tracking-widest mb-1">Authenticity Check</h5>
                <p className="text-sm text-amber-200/80 leading-relaxed font-medium">
                  Every Twincord certificate contains a unique digital fingerprint. If you encounter any issues with verification, please contact our support division immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCertificate;
