"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessages = void 0;
const moment_1 = __importDefault(require("moment"));
const formatMessages = (data) => {
    const { email, content } = data;
    return {
        email,
        content,
        time: moment_1.default().format('MM/DD/YYYY h:mm a'),
    };
};
exports.formatMessages = formatMessages;
