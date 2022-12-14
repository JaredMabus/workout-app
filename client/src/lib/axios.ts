import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

axios.defaults.baseURL = `${baseUrl}/api/`;
axios.defaults.withCredentials = true;

axios.defaults.headers.common = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
axios.defaults.headers.post = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
axios.defaults.headers.get = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export default axios;
