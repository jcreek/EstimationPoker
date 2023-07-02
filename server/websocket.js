import { Server, OPEN } from 'ws';

const handler = async (event, context) => {
  const wss = new Server({ noServer: true });

  const clients = new Map();
  const estimates = new Map();

  wss.on('connection', (socket) => {
    const roomID = new URL(event.headers.referer).pathname.replace('/', '');

    clients.set(socket, roomID);

    function broadcast(roomID, message) {
      wss.clients.forEach((client) => {
        if (clients.get(client) === roomID && client !== socket && client.readyState === OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }

    broadcast(roomID, { type: 'user-joined', message: 'A new user has joined the room' });

    socket.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.type === 'select-estimate') {
        const { user, estimate } = data;

        if (!estimates.has(roomID)) {
          estimates.set(roomID, new Map());
        }
        estimates.get(roomID).set(user, estimate);

        broadcast(roomID, { type: 'estimate-selected', user, estimate });
      }
    });

    socket.on('close', () => {
      const user = clients.get(socket);

      clients.delete(socket);

      if (estimates.has(roomID)) {
        estimates.get(roomID).delete(user);
      }

      broadcast(roomID, { type: 'user-left', message: `${user} has left the room` });

      if (estimates.has(roomID) && estimates.get(roomID).size === 0) {
        estimates.delete(roomID);
        broadcast(roomID, { type: 'estimation-closed', message: 'Estimation closed' });
      } else if (!estimates.has(roomID)) {
        broadcast(roomID, { type: 'estimation-started', message: 'Estimation started again' });
      }
    });
  });

  wss.handleUpgrade(event, event.socket, Buffer.from(''), (ws) => {
    wss.emit('connection', ws, event);
  });

  return {
    statusCode: 200,
    body: 'WebSocket server is running',
  };
};

export default { handler };
