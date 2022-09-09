import { axiosInstance } from "../utils";

const taskRequests = {
    getSettings: async () => {
        const data = await axiosInstance.get(`/tinymce/settings`);
        return data;
    },
    setSettings: async (data) => {
        return await axiosInstance.post(`/tinymce/settings`, {
            apiKey: data,
        });
    },
};
export default taskRequests;
