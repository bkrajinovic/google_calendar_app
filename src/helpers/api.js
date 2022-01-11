import axios from "axios";
import localforage from "localforage";

const api = {
  get: async (url) => {
    let config = null;
    const token = await localforage.getItem("access_token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return await axios.get(url, config);
  },
  post: async (url, data = undefined) => {
    let config = null;
    const token = await localforage.getItem("access_token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return await axios.post(url, data, config);
  },
  delete: async (url) => {
    let config = null;
    const token = await localforage.getItem("access_token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return await axios.delete(url, config);
  },
};

export default api;
