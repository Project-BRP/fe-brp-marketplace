import { io } from "socket.io-client";
import { baseURL } from "./api"; // Menggunakan baseURL dari konfigurasi API Anda

const URL = baseURL?.replace("/api", "") || "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false, // Kita akan menghubungkan secara manual
});
