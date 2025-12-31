import api from './api';

/**
 * Design Management API
 */
export const designAPI = {
    // Get all designs
    getAll: (params = {}) => api.get('/designs', { params }),

    // Get single design
    getById: (id) => api.get(`/designs/${id}`),

    // Create new design
    create: (formData) => {
        return api.post('/designs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Update design
    update: (id, data) => api.put(`/designs/${id}`, data),

    // Delete design
    delete: (id) => api.delete(`/designs/${id}`),

    // Get design statistics
    getStats: () => api.get('/designs/stats/summary')
};

/**
 * Bulk Upload API
 */
export const bulkAPI = {
    // Validate CSV file
    validateCSV: (file) => {
        const formData = new FormData();
        formData.append('csvFile', file);
        return api.post('/bulk/validate-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Upload CSV and generate certificates
    upload: (file, designId, certificateType, sendEmails = false) => {
        const formData = new FormData();
        formData.append('csvFile', file);
        formData.append('designId', designId);
        formData.append('certificateType', certificateType);
        formData.append('sendEmails', sendEmails.toString());

        return api.post('/bulk/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Get upload history
    getHistory: (params = {}) => api.get('/bulk/history', { params }),

    // Get single upload details
    getById: (id) => api.get(`/bulk/${id}`),

    // Get bulk statistics
    getStats: () => api.get('/bulk/stats/summary')
};

/**
 * Email API
 */
export const emailAPI = {
    // Send single email
    send: (emailData) => api.post('/email/send', emailData),

    // Send test email
    sendTest: (email) => api.post('/email/test', { to: email }),

    // Verify email configuration
    verifyConfig: () => api.get('/email/verify-config')
};

/**
 * Analytics API
 */
export const analyticsAPI = {
    // Get comprehensive dashboard statistics
    getDashboardStats: async () => {
        try {
            const [internStats, designStats, bulkStats] = await Promise.all([
                api.get('/interns/stats'),
                api.get('/designs/stats/summary'),
                api.get('/bulk/stats/summary')
            ]);

            return {
                success: true,
                data: {
                    interns: internStats.data,
                    designs: designStats.data,
                    bulk: bulkStats.data
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export default {
    designAPI,
    bulkAPI,
    emailAPI,
    analyticsAPI
};
