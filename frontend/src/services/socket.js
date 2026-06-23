import { io } from "socket.io-client";

const socket = io(
    import.meta.env.VITE_API_URL,
    {
        transports: ["websocket"]
    }
);

socket.on("connect", () => {
    console.log("SOCKET CONECTADO", socket.id);
});

socket.on("connect_error", err => {
    console.log("ERRO SOCKET", err);
});

export default socket;