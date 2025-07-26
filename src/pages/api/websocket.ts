// src/pages/api/websocket.ts
// WebSocket server endpoint for Helixar Blueprint Insight. Handles real-time communication between client and server for live updates.
// Designed for security, scalability, and extensibility.

import type { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws'; // Corrected import
import { Server } from 'http';

interface CustomServer extends Server {
  ws?: WebSocketServer; // Declare ws property
}

interface CustomSocket extends Exclude<NextApiRequest['socket'], undefined> {
  server?: CustomServer;
}

interface CustomNextApiResponse extends NextApiResponse {
  socket: CustomSocket;
}

export default function handler(req: NextApiRequest, res: CustomNextApiResponse) {
  const server = res.socket.server as CustomServer; // Cast server to CustomServer

  if (!server.ws) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
      ws.send('Welcome to the WebSocket server!');

      ws.on('message', (message) => {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(message.toString());
          }
        });
      });

      ws.on('close', () => {
      });
    });

    server.ws = wss;
  }
  res.end();
} 