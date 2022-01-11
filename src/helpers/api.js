import axios from "axios";
import localforage from "localforage";

const endpoint = "";

const getPath = (url) => `${endpoint}${url}`;

const api = {
  get: (url, config = undefined) => {
    return localforage.getItem("access_token").then((token) => {
      if (!config) {
        config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      } else if (config && !config.headers) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
      return axios.get(getPath(url), config);
    });
  },
  post: (url, data = undefined, config = undefined) => {
    return localforage.getItem("access_token").then((token) => {
      if (!config) {
        config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      } else if (config && !config.headers) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
      return axios.post(getPath(url), data, config);
    });
  },
  delete: (url, config = undefined) => {
    return localforage.getItem("access_token").then((token) => {
      if (!config) {
        config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      } else if (config && !config.headers) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
      return axios.delete(getPath(url), config);
    });
  },
};

export default api;
