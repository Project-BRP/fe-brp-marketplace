import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false, // Kita akan menghubungkan secara manual
});
