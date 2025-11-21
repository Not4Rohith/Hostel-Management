import { api } from '../axiosConfig';

export const StudentService = {
  // Complaints
  getComplaints: async (userId?: string, isAdmin = false) => {
    const url = isAdmin ? '/complaints/all' : `/complaints/my/${userId}`;
    const res = await api.get(url);
    return res.data;
  },
  
  submitComplaint: async (data: any) => {
    return await api.post('/complaints', data);
  },

  resolveComplaint: async (id: string) => {
    return await api.put(`/complaints/${id}/resolve`);
  },

  // Gate Pass
  getGatePasses: async (isAdmin = false) => {
    const url = isAdmin ? '/admin/gatepass' : '/student/gatepass'; // Backend route needed
    const res = await api.get(url);
    return res.data;
  },

  requestGatePass: async (data: any) => {
    return await api.post('/student/gatepass', data);
  },

  updateGatePassStatus: async (id: string, status: string) => {
    return await api.put(`/admin/gatepass/${id}`, { status });
  },

  // Lost & Found
  getLostItems: async () => {
    const res = await api.get('/lostfound');
    return res.data;
  },

  reportLostItem: async (data: any) => {
    return await api.post('/lostfound', data);
  },

  getProfile: async (userId: string) => {
    const res = await api.get(`/auth/me/${userId}`);
    return res.data;
  },
};