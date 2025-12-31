import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { internAPI } from '../services/api';

const DEPARTMENTS = [
  'Web Development',
  'App Development',
  'UI/UX Design',
  'Cyber Security',
  'Data Science',
  'Digital Marketing',
  'Machine Learning',
];

const AddIntern = () => {
  const navigate = useNavigate();
  const { addIntern } = useAppContext();

  const [formData, setFormData] = useState({
    internId: '',
    password: '',
    name: '',
    email: '',
    department: '',
    startDate: '',
    endDate: '',
    type: 'Intern',
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // Backend
  const [touched, setTouched] = useState({}); // Client-side

  // Real-time Validation Logic
  const validateField = (name, value) => {
    switch (name) {
      case 'internId':
        return /^[A-Z0-9\-_]{6,}$/i.test(value) ? null : 'Must be 6+ alphanumeric chars (e.g. INT-001)';
      case 'password':
        return value && value.length >= 6 ? null : 'Password must be at least 6 characters';
      case 'email':
        // Supports .b, .co.in, .org, yahoo.com, etc.
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? null : 'Invalid email format (e.g. user@example.com)';
      case 'name':
        // Letters and spaces only
        if (value.length < 2) return 'Name must be at least 2 chars';
        return /^[a-zA-Z\s.]*$/.test(value) ? null : 'Name must contain only letters, spaces, and dots';
      case 'status':
      case 'department':
      case 'startDate':
      case 'endDate':
        return value ? null : 'This field is required';
      default:
        return null;
    }
  };

  const getInputClass = (fieldName) => {
    const baseClass = "input-field";
    const value = formData[fieldName];
    const isTouched = touched[fieldName];
    const backendError = fieldErrors[fieldName];
    const clientError = validateField(fieldName, value);

    // Error: Red
    if (backendError || (isTouched && clientError)) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-100 bg-red-500/10`;
    }

    // Success: Green (Only if has value and valid)
    if (isTouched && !clientError && value) {
      return `${baseClass} border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-emerald-100 bg-emerald-500/10`;
    }

    // Default
    return baseClass;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validate all fields on submit
    const newTouched = {};
    let hasClientErrors = false;
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      if (validateField(key, formData[key])) hasClientErrors = true;
    });
    setTouched(newTouched);

    if (hasClientErrors) {
      setError('Please fix the highlighted errors before submitting.');
      setLoading(false);
      return;
    }

    try {
      const response = await internAPI.create(formData);
      if (response && response.success) {
        if (addIntern) addIntern(response.data);
        navigate('/admin/dashboard');
      } else {
        const errorMsg = response?.message || 'Failed to create intern.';
        const debugInfo = response?.errors ? JSON.stringify(response.errors) : '';
        setError(`${errorMsg} ${debugInfo}`);
        if (response?.errors) {
          if (Array.isArray(response.errors)) {
            const errorObj = {};
            response.errors.forEach(err => {
              const key = err.field || err.param;
              if (key) errorObj[key] = err.message || err.msg;
            });
            setFieldErrors(errorObj);
          } else {
            setFieldErrors(response.errors);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Connection error.');
      const resErrors = err?.response?.data?.errors;
      if (resErrors) {
        if (Array.isArray(resErrors)) {
          const errorObj = {};
          resErrors.forEach(err => {
            const key = err.field || err.param;
            if (key) errorObj[key] = err.message || err.msg;
          });
          setFieldErrors(errorObj);
        } else {
          setFieldErrors(resErrors);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ name }) => {
    // Priority: Backend Error > Client Error (if touched)
    const backendErr = fieldErrors[name];
    const clientErr = touched[name] ? validateField(name, formData[name]) : null;
    const msg = backendErr || clientErr;

    if (!msg) return null;
    return <p className="text-xs font-bold text-red-400 mt-2 ml-1 animate-pulse flex items-center gap-1">
      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
      {msg}
    </p>;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="page-container"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="heading-xl">Add New Intern</h1>
            <p className="text-muted mt-1 font-medium">Create a new record in the system.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="btn-secondary hover:scale-105 transition-transform"
          >
            Cancel
          </button>
        </motion.div>

        {/* Global Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-950/30 rounded-xl border border-red-500/30 flex items-start gap-3 backdrop-blur-sm"
          >
            <div className="text-red-500 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wide">Validation Error</h3>
              <p className="text-sm font-medium text-red-300 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1: Identity */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="card p-8 card-hover"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"></span>
              Identity Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label-text">Intern ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="internId"
                  placeholder="e.g. INT-2024-001"
                  value={formData.internId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('internId')}
                  required
                />
                <FieldError name="internId" />
              </div>

              <div>
                <label className="label-text">Password <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="password"
                  placeholder="Create Login Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('password')}
                  required
                />
                <FieldError name="password" />
              </div>

              <div>
                <label className="label-text">Internship Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input-field appearance-none cursor-pointer"
                  >
                    <option value="Intern">Intern</option>
                    <option value="Implant">Implant</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="label-text">Current Status</label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input-field appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="label-text">Full Name <span className="text-red-500">*</span></label>
                <p className="text-xs text-slate-400 mb-2 font-medium">Use letters, spaces, and dots (e.g. "John D.")</p>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full legal name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('name')}
                  required
                />
                <FieldError name="name" />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Role & Contact */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="card p-8 card-hover"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>
              Role & Assignment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label-text">Email Address <span className="text-red-500">*</span></label>
                <p className="text-xs text-slate-400 mb-2 font-medium">Any valid email (e.g. user@gmail.com, @yahoo.in)</p>
                <input
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('email')}
                  required
                />
                <FieldError name="email" />
              </div>

              <div>
                <label className="label-text">Department <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('department') + " appearance-none"}
                    required
                  >
                    <option value="" className="bg-slate-800">Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <FieldError name="department" />
              </div>
            </div>
          </motion.div>

          {/* Section 3: Timeline */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="card p-8 card-hover"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
              Duration Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label-text">Start Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('startDate') + " text-slate-400"}
                  required
                />
                <FieldError name="startDate" />
              </div>

              <div>
                <label className="label-text">End Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('endDate') + " text-slate-400"}
                  required
                />
                <FieldError name="endDate" />
              </div>
            </div>
          </motion.div>

          {/* Footer Action */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="flex items-center justify-end pt-4"
          >
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-4 px-12 text-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
            >
              {loading ? (
                <>Saving...</>
              ) : (
                <>Create Intern Record &rarr;</>
              )}
            </button>
          </motion.div>

        </form>
      </div>
    </motion.div>
  );
};

export default AddIntern;