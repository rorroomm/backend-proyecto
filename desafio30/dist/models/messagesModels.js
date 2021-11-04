"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mensajes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messagesCollection = 'messages';
const MessagesSchema = new mongoose_1.default.Schema({
    email: { type: String, require: true, max: 64 },
    msg: { type: String, require: true, min: 1 },
    timestamp: { type: Date, default: Date.now() }
});
exports.mensajes = mongoose_1.default.model(messagesCollection, MessagesSchema);
