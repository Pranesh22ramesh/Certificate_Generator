import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { internAPI } from '../services/api';
import { formatDateInput } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const DEPARTMENTS = [
  'Web Development',
  'App Development',
  'UI/UX Design',
  'Cyber Security',
  'Data Science',
  'Digital Marketing',
  'Machine Learning',
];

const EditIntern = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateIntern } = useAppContext();

  const [formData, setFormData] = useState({
    internId: '',
    name: '',
    email: '',
    department: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    type: 'Intern',
    password: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [notFound, setNotFound] = useState(false);

  // Real-time Validation Logic (Matched with AddIntern)
  const validateField = (name, value) => {
    switch (name) {
      case 'internId':
        return null; // ID is read-only in Edit
      case 'email':
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? null : 'Invalid email format';
      case 'name':
        if (value.length < 2) return 'Name must be at least 2 chars';
        return /^[a-zA-Z\s.]*$/.test(value) ? null : 'Name must contain only letters, spaces, and dots';
      case 'status':
      case 'department':
      case 'startDate':
      case 'endDate':
      case 'type':
        return value ? null : 'This field is required';
      case 'password':
        // Optional in Edit, but if provided must be min 6
        if (!value) return null;
        return value.length >= 6 ? null : 'Password must be at least 6 characters';
      default:
        return null;
    }
  };

  const getInputClass = (fieldName) => {
    const baseClass = "input-field";
    if (fieldName === 'internId' || fieldName === 'name' || fieldName === 'email' || fieldName === 'password')
      return `${baseClass} opacity-50 cursor-not-allowed bg-slate-800 text-slate-400`; // Read-only style

    const value = formData[fieldName];
    const isTouched = touched[fieldName];
    const backendError = fieldErrors[fieldName];
    const clientError = validateField(fieldName, value);

    // Error State (Red)
    if (backendError || (isTouched && clientError)) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-100 bg-red-500/10`;
    }

    // Success State (Green)
    if (isTouched && !clientError && value) {
      return `${baseClass} border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-emerald-100 bg-emerald-500/10`;
    }

    return baseClass;
  };

  useEffect(() => {
    const loadIntern = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await internAPI.getById(id);
        if (response.success) {
          const intern = response.data;
          setFormData({
            internId: intern.internId || '',
            name: intern.name || '',
            email: intern.email || '',
            department: intern.department || '',
            startDate: formatDateInput(intern.startDate) || '',
            endDate: formatDateInput(intern.endDate) || '',
            status: intern.status || 'Active',
            type: intern.type || 'Intern'
          });
        } else {
          if (response.message && response.message.includes('not found')) {
            setNotFound(true);
          } else {
            setError(response.message || 'Failed to load intern');
          }
        }
      } catch (err) {
        console.error('Load intern error:', err);
        setError('Failed to load intern details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadIntern();
  }, [id]);

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
    setError('');
    setFieldErrors({});

    const newTouched = {};
    let hasClientErrors = false;
    Object.keys(formData).forEach(key => {
      if (key !== 'internId' && key !== 'name' && key !== 'email' && key !== 'password') { // Skip Identity validation
        newTouched[key] = true;
        if (validateField(key, formData[key])) hasClientErrors = true;
      }
    });
    setTouched(newTouched);

    if (hasClientErrors) {
      setError('Please fix the highlighted errors before submitting.');
      return;
    }

    try {
      const response = await internAPI.update(id, formData);
      if (response && response.success) {
        if (updateIntern) updateIntern(response.data);
        navigate('/admin/dashboard');
      } else {
        setError(response?.message || 'Failed to update intern.');
        if (response?.errors) {
          if (Array.isArray(response.errors)) {
            const errorObj = {};
            response.errors.forEach(err => {
              const key = err.field || err.path || err.param;
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
      setError(err?.message || 'Connection error.');
      const resErrors = err?.response?.data?.errors;
      if (resErrors) {
        if (Array.isArray(resErrors)) {
          const errorObj = {};
          resErrors.forEach(err => {
            const key = err.field || err.path || err.param;
            if (key) errorObj[key] = err.message || err.msg;
          });
          setFieldErrors(errorObj);
        } else {
          setFieldErrors(resErrors);
        }
      }
    }
  };

  const FieldError = ({ name }) => {
    const backendErr = fieldErrors[name];
    const clientErr = touched[name] ? validateField(name, formData[name]) : null;
    const msg = backendErr || clientErr;
    if (!msg) return null;
    return <p className="text-xs font-bold text-red-400 mt-2 ml-1 animate-pulse flex items-center gap-1"><span className="w-1 h-1 bg-red-400 rounded-full"></span>{msg}</p>;
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading Details..." />;
  if (notFound) return <div className="page-container flex justify-center pt-20"><div className="text-center"><h2 className="text-2xl text-white">Intern Not Found</h2><button onClick={() => navigate('/admin/dashboard')} className="mt-4 text-sky-400 underline">Back</button></div></div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-xl">Edit Intern</h1>
            <p className="text-muted mt-1 font-medium italic text-sky-400/80">Identity fields (Name, Email, Password) are locked to maintain cross-certificate integrity.</p>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">Cancel</button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 bg-red-950/30 rounded-xl border border-red-500/30 flex items-start gap-3 backdrop-blur-sm">
            <div className="text-red-500 mt-0.5"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
            <div><h3 className="text-sm font-bold text-red-400 uppercase tracking-wide">Error</h3><p className="text-sm font-medium text-red-300 mt-1">{error}</p></div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card p-8 card-hover">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><span className="w-2 h-8 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"></span>Identity Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label-text">Intern ID</label>
                <input type="text" name="internId" value={formData.internId} disabled className={getInputClass('internId')} />
              </div>

              <div>
                <label className="label-text">Password</label>
                <input
                  type="text"
                  name="password"
                  value="********"
                  disabled
                  className={getInputClass('password')}
                />
                <p className="text-[10px] text-slate-500 mt-1 ml-1 leading-tight">Identity fields cannot be modified after creation.</p>
              </div>

              <div>
                <label className="label-text">Internship Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="type" value={formData.type} onChange={handleChange} onBlur={handleBlur} className="input-field appearance-none cursor-pointer">
                    <option value="Intern">Intern</option>
                    <option value="Implant">Implant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-text">Current Status</label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleChange} onBlur={handleBlur} className="input-field appearance-none cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="label-text">Full Name</label>
                <input type="text" name="name" value={formData.name} disabled className={getInputClass('name')} />
                <p className="text-[10px] text-slate-500 mt-1 ml-1 leading-tight text-right">To change identity, delete and recreate this record.</p>
              </div>
            </div>
          </div>

          <div className="card p-8 card-hover">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><span className="w-2 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>Role & Assignment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label-text">Email Address</label>
                <input type="email" name="email" value={formData.email} disabled className={getInputClass('email')} />
              </div>
              <div>
                <label className="label-text">Department <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="department" value={formData.department} onChange={handleChange} onBlur={handleBlur} className={getInputClass('department') + " appearance-none"} required>
                    <option value="" className="bg-slate-800">Select Department</option>
                    {DEPARTMENTS.map(dept => (<option key={dept} value={dept} className="bg-slate-800">{dept}</option>))}
                  </select>
                </div>
                <FieldError name="department" />
              </div>
            </div>
          </div>

          <div className="card p-8 card-hover">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><span className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>Duration Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label-text">Start Date <span className="text-red-500">*</span></label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} onBlur={handleBlur} className={getInputClass('startDate') + " text-slate-400"} required />
                <FieldError name="startDate" />
              </div>
              <div>
                <label className="label-text">End Date <span className="text-red-500">*</span></label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} onBlur={handleBlur} className={getInputClass('endDate') + " text-slate-400"} required />
                <FieldError name="endDate" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4">
            <button type="submit" className="btn-primary py-4 px-12 text-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditIntern;