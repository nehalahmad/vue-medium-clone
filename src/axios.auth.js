import axios from "axios";

const access_token = localStorage.getItem("token");
const instance = axios.create({
  baseURL: "https://conduit.productionready.io/api/",
  headers: {
    Authorization: `Token ${access_token}`,
    "Access-Control-Allow-Origin": "*",
  },
});

export default instance;
