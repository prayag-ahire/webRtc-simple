"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    console.log('New client connected');
    ws.on('message', function message(data) {
        try {
            const message = JSON.parse(data.toString());
            if (message.type === 'sender') {
                senderSocket = ws;
                console.log('Sender connected');
            }
            else if (message.type === 'receiver') {
                receiverSocket = ws;
                console.log('Receiver connected');
            }
            else if (message.type === 'createOffer') {
                if (ws !== senderSocket)
                    return;
                console.log('Forwarding offer to receiver');
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
            }
            else if (message.type === 'createAnswer') {
                if (ws !== receiverSocket)
                    return;
                console.log('Forwarding answer to sender');
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
            }
            else if (message.type === 'iceCandidate') {
                if (ws === senderSocket) {
                    console.log('Forwarding ICE candidate to receiver');
                    receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                }
                else if (ws === receiverSocket) {
                    console.log('Forwarding ICE candidate to sender');
                    senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                }
            }
            else {
                console.log('Unknown message type:', message.type);
            }
        }
        catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
    ws.on('close', () => {
        if (ws === senderSocket)
            senderSocket = null;
        if (ws === receiverSocket)
            receiverSocket = null;
        console.log('Client disconnected');
    });
});
console.log('WebSocket server running on ws://localhost:8080');
