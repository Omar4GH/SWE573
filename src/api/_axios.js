import axios from "axios";

// Local: http://localhost:8800/api
// Google Cloud Run Live: https://geomemoirs-backend-sh52mcq4ba-oa.a.run.app/api
// AWS EC2 Live : http://35.157.83.4:8800/api

let config = {
  baseURL: "https://server.omarghamrawi.net/api",
};

const _axios = axios.create(config);

// Add a request interceptor
_axios.interceptors.request.use(function (config) {
 
  return config;
});

export default _axios;