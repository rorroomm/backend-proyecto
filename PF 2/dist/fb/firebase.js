"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collection = void 0;
var admin = require("firebase-admin");
var path_1 = __importDefault(require("path"));
var __dirname = path_1.default.resolve();
var serviceAccount = require(__dirname + "/db/backendcoder-26f06-firebase-adminsdk-sj1hq-2d11f4dfff.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "backendcoder-26f06.firebaseio.com",
});
var db = admin.firestore();
exports.collection = db.collection("productos");
