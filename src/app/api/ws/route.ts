import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';
import { parse as parseCookie } from 'cookie';
import { db } from '~/db';
import { clients, rooms } from '~/db/schema';
import { eq } from 'drizzle-orm';

export function GET() {
  const headers = new Headers();
  headers.set('Connection', 'Upgrade');
  headers.set('Upgrade', 'websocket');
  return new Response('Upgrade Required', { status: 426, headers });
}

export function SOCKET(
  client: WebSocket,
  request: IncomingMessage,
  server: WebSocketServer
) {
  const send = (payload: unknown) => client.send(JSON.stringify(payload));

  // Parse the client_id from the cookie
  const cookies = parseCookie(request.headers.cookie ?? '');
  const clientId = cookies['client_id'] ?? nanoid(); // Generate a new one if not present

  (client as any).id = clientId; // Assign the client_id to the WebSocket client

  if (clientId) {
    handleAuthentication(clientId);
  }

  console.log(`New client connected! Client ID: ${clientId}`);

  client.on('message', async (message: string) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('message', parsedMessage);
      await handleEvent(client, parsedMessage);
    } catch (error) {
      send({ error: 'Invalid message format' });
    }
  });

  client.on('close', async () => {
    const roomId = await getClientRoom(clientId);
    if (roomId) {
      await removeClientFromRoom(clientId);
      broadcast(roomId, { author: 'Server', content: `Client ${clientId} has disconnected.` });
    }
  });

  async function handleEvent(client: WebSocket, message: { type: string; payload: any }) {
    switch (message.type) {
      case 'authenticate':
        await handleAuthentication(clientId);
        break;
      case 'createOrJoinRoom':
        await handleCreateOrJoinRoom(client, message.payload);
        break;
      case 'message':
        await handleMessage(client, message.payload);
        break;
      default:
        send({ error: 'Unknown event type' });
    }
  }

  async function handleAuthentication(clientId: string) {
    const existingClient = db.select().from(clients).where(eq(clients.id, clientId)).get();
    console.log('existingClient', existingClient)
    if (!existingClient) {
      try {
        const newClient = db.insert(clients).values({ id: clientId, roomId: '' }).run();
        console.log('Client Created', newClient);
      } catch (error) {
        console.error('Error creating Client', error);
      }
    }
    send({ type: 'authenticated', success: true, clientId });
  }

  async function handleCreateOrJoinRoom(client: WebSocket, payload: { roomId?: string }) {
    const clientId = (client as any).id;
    let room;
    let roomId = payload.roomId;
    if (!roomId) {
      roomId = nanoid();
    }

    try {
      room = db.select().from(rooms).where(eq(rooms.id, roomId)).get();
      console.log('founded room', room);
    } catch (error) {
      console.error('Error getting room');
    }

    if (!room) {
      roomId = nanoid();
      room = db.insert(rooms).values({ id: roomId, name: roomId }).run();
      console.log('Room Created', room)
    }


    db.update(clients).set({ roomId }).where(eq(clients.id, clientId)).run();

    send({ type: 'roomJoined', payload: { clientId: clientId, roomId } });
    broadcast(roomId, { clientId: clientId, author: 'Server', content: `Client ${clientId} has joined the room.` });
  }

  async function handleMessage(client: WebSocket, payload: { roomId: string; message: string }) {
    const clientId = (client as any).id;
    console.log('handleMessage', clientId)
    const roomId = await getClientRoom(clientId);
    if (clientId && roomId === payload.roomId) {
      broadcast(payload.roomId, { type: 'message', payload: { ...payload, clientId: clientId } });
    } else {
      send({ error: 'You are not subscribed to this room' });
    }
  }

  async function broadcast(roomId: string, payload: any) {
    const clientsInRoom = db.select().from(clients).where(eq(clients.roomId, roomId)).all();
    console.log('clientsInRoom', clientsInRoom);
    clientsInRoom.forEach(({ id: wsId }) => {
      const wsClient = getClientByWsId(wsId);
      console.log('wsClient', wsClient ? 'OK' : 'KO');
      if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        sendTo(wsClient, payload);
      }
    });
  }

  function sendTo(client: WebSocket, payload: any) {
    console.log('sendTo', payload);
    client.send(JSON.stringify(payload));
  }

  async function getClientRoom(clientId: string): Promise<string | null> {
    const client = await db.select().from(clients).where(eq(clients.id, clientId)).get();
    return client ? client.roomId : null;
  }

  async function removeClientFromRoom(clientId: string) {
    db.update(clients).set({ roomId: '' }).where(eq(clients.id, clientId)).run();
  }

  function getClientByWsId(clientId: string): WebSocket | undefined {
    return Array.from(server.clients).find((client) => (client as any).id === clientId);
  }
}
