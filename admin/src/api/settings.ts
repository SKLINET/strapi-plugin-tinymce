import axiosInstance from '../utils/axiosInstance';

const taskRequests = {
    getSettings: async () => {
        const data = await axiosInstance.get(`/tinymce/settings`);
        return data;
    },
    setSettings: async (data: any) => {
        return await axiosInstance.post(`/tinymce/settings`, {
            apiKey: data,
        });
    },
};
export default taskRequests;
