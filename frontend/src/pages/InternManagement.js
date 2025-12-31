import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { internAPI } from '../services/api';
import { formatDate, getDaysRemaining } from '../utils/helpers';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '../components/Input';
import Select from '../components/Select';

const InternManagement = () => {
  const navigate = useNavigate();
  const { interns, setInterns, error, setError, clearError } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    loadInterns();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInterns = async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await internAPI.getAll();
      
      if (response.success) {
        setInterns(response.data.interns || []);
      } else {
        setError(response.message || 'Failed to load interns');
      }
    } catch (err) {
      console.error('Load interns error:', err);
      setError('Failed to load interns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (internId, internName) => {
    if (!window.confirm(`Are you sure you want to delete intern "${internName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(internId);
      
      const response = await internAPI.delete(internId);
      
      if (response.success) {
        // Remove from local state
        setInterns(prev => prev.filter(intern => intern._id !== internId));
      } else {
        setError(response.message || 'Failed to delete intern');
      }
    } catch (err) {
      console.error('Delete intern error:', err);
      setError('Failed to delete intern');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (internId) => {
    navigate(`/admin/edit/${internId}`);
  };

  const handleAddNew = () => {
    navigate('/admin/add-intern');
  };

  // Filter interns based on search and filters
  const filteredInterns = interns.filter(intern => {
    const matchesSearch = !searchTerm || 
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.internId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || intern.status === statusFilter;
    const matchesDepartment = !departmentFilter || intern.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(interns.map(intern => intern.department))].sort();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Completed': return 'blue';
      case 'Terminated': return 'red';
      default: return 'gray';
    }
  };

  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    
    if (diffWeeks > 0) {
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`;
    }
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Intern Management</h1>
            <p className="mt-2 text-gray-600">Manage all intern records and certificates</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              onClick={handleAddNew}
              icon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Add New Intern
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} dismissible onClose={clearError} />
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Terminated', label: 'Terminated' }
              ]}
            />
            
            <Select
              placeholder="Filter by department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={[
                { value: '', label: 'All Departments' },
                ...departments.map(dept => ({ value: dept, label: dept }))
              ]}
            />
          </div>
        </div>
      </div>

      {/* Intern List */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Interns ({filteredInterns.length})
          </h2>
        </div>
        
        <div className="card-body p-0">
          {filteredInterns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intern
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterns.map((intern) => (
                    <tr key={intern._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {intern.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {intern.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {intern.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {intern.internId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{intern.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(intern.startDate, { month: 'short', day: 'numeric' })} - {formatDate(intern.endDate, { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDuration(intern.startDate, intern.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={getStatusColor(intern.status)}>
                          {intern.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {intern.status === 'Active' ? (
                            <>
                              {getDaysRemaining(intern.endDate) > 0 ? (
                                <span className="text-green-600">
                                  {getDaysRemaining(intern.endDate)} days remaining
                                </span>
                              ) : (
                                <span className="text-red-600">Overdue</span>
                              )}
                            </>
                          ) : intern.status === 'Completed' ? (
                            <span className="text-blue-600">Completed</span>
                          ) : (
                            <span className="text-gray-500">Terminated</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(intern._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(intern._id, intern.name)}
                            loading={isDeleting === intern._id}
                            disabled={isDeleting === intern._id}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter || departmentFilter ? 'No interns found' : 'No interns yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter || departmentFilter 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by adding your first intern'}
              </p>
              
              {!(searchTerm || statusFilter || departmentFilter) && (
                <Button
                  variant="primary"
                  onClick={handleAddNew}
                  icon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  }
                >
                  Add New Intern
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternManagement;