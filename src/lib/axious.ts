import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080", // ใช้ URL จาก .env.local หรือค่าเริ่มต้น
  timeout: 5000, // Set a timeout of 5 seconds
  headers: {
    
  },
});

// // แนบ token ทุกครั้งก่อนส่ง request
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default api;
