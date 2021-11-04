"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    PORT: process.env.PORT || 8080,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || 'faceId',
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || 'faceSecret',
};
