import axios from "axios";

const baseUrl = process.env.REACT_APP_HOST;

axios.defaults.baseURL = `${baseUrl || "http:localhost:3001"}/api/`;
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
axios.defaults.headers.delete = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export default axios;
