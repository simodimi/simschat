import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, //permet d'envoyer des cookies au serveur
});
export default api;
