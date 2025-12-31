import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthSelector } from '../context/AppContext';

const Home = () => {
  const { isAuthenticated, userType } = useAuthSelector();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      title: 'Software Development',
      description: 'Building scalable, high-performance web and mobile applications tailored to enterprise needs.',
      icon: (
        <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Cloud Solutions',
      description: 'Secure, reliable cloud infrastructure and migration services to modernize your business operations.',
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: 'Talent Development',
      description: 'Empowering the next generation of tech leaders through our rigorous, industry-aligned internship programs.',
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-sky-500/30">

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-sky-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full animate-blob"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 z-10">
        <div className="container-custom relative">
          <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/80 border border-slate-700 mb-10 backdrop-blur-md shadow-xl hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
              <span className="text-sm font-bold tracking-wide text-sky-200 uppercase">Innovating Since 2024</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              Forging the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 filter drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">Digital Future.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Twincord Technologies delivers enterprise-grade software solutions and nurtures world-class talent. We bridge the gap between complex problems and elegant solutions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {!isAuthenticated ? (
                <>
                  <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-sky-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105">
                    Partner With Us
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105">
                    Employee & Intern Login
                  </Link>
                </>
              ) : (
                <Link to={userType === 'admin' ? '/admin/dashboard' : '/user/certificate'} className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:scale-105 transition-transform text-white">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <div className="border-y border-white/5 bg-slate-950/50 backdrop-blur-md relative z-10">
        <div className="container-custom py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/5">
            {[
              { val: '50+', label: 'Enterprise Clients' },
              { val: '100+', label: 'Projects Delivered' },
              { val: '500+', label: 'Interns Certified' },
              { val: '24/7', label: 'Support System' }
            ].map((s, i) => (
              <div key={i} className="group cursor-default">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-indigo-400 transition-all duration-300">{s.val}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-32 relative z-10">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-sky-400 font-bold tracking-widest uppercase text-sm mb-4">Who We Are</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">We Build Technology That Matters.</h3>
              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  At Twincord Technologies, we believe in the power of innovation. Established with a vision to transform the digital landscape, we specialize in creating bespoke software solutions that drive business growth.
                </p>
                <p>
                  Beyond development, we are committed to education. Our <span className="text-white font-bold">Twincord Internship Program</span> selects the brightest minds and equips them with real-world skills, validated through our industry-recognized certification system.
                </p>
              </div>
              <div className="mt-12">
                <Link to="/about" className="text-sky-400 font-bold border-b-2 border-sky-400/30 pb-1 hover:text-sky-300 hover:border-sky-300 transition-colors">Read Our Story &rarr;</Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-purple-600 rounded-[2rem] transform rotate-3 blur-lg opacity-30"></div>
              <div className="relative bg-slate-800 rounded-[2rem] border border-white/5 p-8 shadow-2xl">
                {/* Abstract Code/Tech Visual */}
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="h-[1px] bg-white/10 w-full my-4"></div>
                  <div className="text-sky-400">import <span className="text-white">Future</span> from <span className="text-emerald-400">'./twincord'</span>;</div>
                  <div className="text-purple-400">const <span className="text-yellow-400">mission</span> = <span className="text-white">async () ={'>'}</span> {'{'}</div>
                  <div className="pl-6 text-slate-300">await <span className="text-blue-400">innovate()</span>;</div>
                  <div className="pl-6 text-slate-300">await <span className="text-blue-400">empower(talent)</span>;</div>
                  <div className="pl-6 text-slate-300">return <span className="text-emerald-400">SUCCESS</span>;</div>
                  <div className="text-purple-400">{'}'};</div>
                  <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-slate-400">System Status</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 w-full h-full"></div>
                    </div>
                    <div className="mt-1 text-right text-xs text-emerald-500">100% Operational</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-slate-800/20 relative z-10 skew-y-3">
        <div className="container-custom -skew-y-3">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sky-400 font-bold tracking-widest uppercase text-sm mb-4">What We Do</h2>
            <h3 className="text-4xl font-bold text-white mb-6">Comprehensive Solutions</h3>
            <p className="text-slate-400 text-lg">From ideation to deployment, we handle every aspect of the digital lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {services.map((s, i) => (
              <div key={i} className="bg-slate-900/50 border border-white/5 p-10 rounded-3xl hover:bg-slate-800 hover:border-sky-500/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 group-hover:bg-slate-700 transition-all">
                  {s.icon}
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{s.title}</h4>
                <p className="text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship CTA */}
      <section className="py-32 relative z-10">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-[3rem] p-12 md:p-24 text-center border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

            <div className="relative z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8">Career Growth</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Start Your Journey.</h2>
              <p className="text-xl text-indigo-200 mb-12 max-w-2xl mx-auto">
                The Twincord Internship Program is more than just training. It's a gateway to your professional career, verified and certified by industry experts.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/verify" className="btn-primary py-4 px-10 bg-white text-indigo-900 hover:bg-indigo-50 hover:text-indigo-950 font-black shadow-lg">Verify Certificate</Link>
                <Link to="/contact" className="px-10 py-4 rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-colors">Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Footer */}
      <footer className="bg-slate-950 pt-24 pb-12 border-t border-slate-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg">T</div>
                <span className="text-2xl font-bold text-white tracking-tight">Twincord</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm">
                Pioneering digital excellence through software development and professional training.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link to="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
                <li><button className="hover:text-sky-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Careers</button></li>
                <li><button className="hover:text-sky-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Partners</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><button className="hover:text-sky-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Web Development</button></li>
                <li><button className="hover:text-sky-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Cloud Consulting</button></li>
                <li><Link to="/verify" className="hover:text-sky-400 transition-colors text-sky-400/80">Certificate Verification</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Support</Link></li>
                <li><button className="hover:text-sky-400 transition-colors bg-transparent border-none p-0 cursor-pointer">LinkedIn</button></li>
                <li><button className="hover:text-sky-400 transition-colors bg-transparent border-none p-0 cursor-pointer">Twitter</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium uppercase tracking-wider">
            <p>&copy; 2024 Twincord Technologies. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-400">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
