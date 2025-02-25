
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: WebSocket | null = null;
let receiverSocket: WebSocket | null = null;

wss.on('connection', function connection(ws: WebSocket) {
  console.log('New client connected');

  ws.on('message', function message(data: string | Buffer) {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'sender') {
        senderSocket = ws;
        console.log('Sender connected');
      } else if (message.type === 'receiver') {
        receiverSocket = ws;
        console.log('Receiver connected');
      } else if (message.type === 'createOffer') {
        if (ws !== senderSocket) return;
        console.log('Forwarding offer to receiver');
        receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
      } else if (message.type === 'createAnswer') {
        if (ws !== receiverSocket) return;
        console.log('Forwarding answer to sender');
        senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
      } else if (message.type === 'iceCandidate') {
        if (ws === senderSocket) {
          console.log('Forwarding ICE candidate to receiver');
          receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
        } else if (ws === receiverSocket) {
          console.log('Forwarding ICE candidate to sender');
          senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
        }
      } else {
        console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  ws.on('close', () => {
    if (ws === senderSocket) senderSocket = null;
    if (ws === receiverSocket) receiverSocket = null;
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');
