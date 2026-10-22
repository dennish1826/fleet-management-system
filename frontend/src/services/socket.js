import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log(`🔌 Connected to Telematics Gateway via socket: ${socket.id}`);
});

socket.on('connect_error', (err) => {
  console.warn('⚠️ Telematics Gateway connection error:', err.message);
});
