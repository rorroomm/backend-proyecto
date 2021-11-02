"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWsServer = void 0;
const messagesModels_1 = require("../models/messagesModels");
const socket_io_1 = require("socket.io");
const initWsServer = (app) => {
    const myWSServer = new socket_io_1.Server(app);
    myWSServer.on("connection", function (socket) {
        console.log("\n\nUn cliente se ha conectado");
        console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
        console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);
        socket.on("askData", () => __awaiter(this, void 0, void 0, function* () {
            console.log("ME LLEGO DATA");
            const messages = yield messagesModels_1.mensajes.find().lean();
            if (messages.length > 0) {
                socket.emit("messages", messages);
            }
        }));
        socket.on("new-message", (data) => __awaiter(this, void 0, void 0, function* () {
            const newMsg = yield messagesModels_1.mensajes.create(data);
            myWSServer.emit("messages", [newMsg]);
        }));
    });
    return myWSServer;
};
exports.initWsServer = initWsServer;
