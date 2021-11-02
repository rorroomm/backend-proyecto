"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = Math.random().toString(36).substring(0, num);
    return result1;
};
exports.default = generateRandomString;
