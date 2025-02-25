"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 8080;
const server = app.listen(port, () => {
    console.log("server is listening....");
});
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        console.log("data form client", data);
        ws.send("thanks buddy!");
    });
});
