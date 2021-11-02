"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./services/server"));
const mongoDB_1 = require("./db/mongoDB");
const sockets_1 = require("./services/sockets");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const getArgs_1 = require("./utils/getArgs");
mongoDB_1.dbConnection();
sockets_1.initWsServer(server_1.default);
const port = getArgs_1.portArgument;
const clusterArgument = getArgs_1.clusterArg || false;
const numCPUs = os_1.default.cpus().length;
if (cluster_1.default.isMaster && clusterArgument) {
    console.log(`NUMERO DE CPUS ===> ${numCPUs}`);
    console.log(`PID MASTER ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died at ${Date()}`);
        cluster_1.default.fork();
    });
}
else {
    server_1.default.listen(getArgs_1.portArgument, () => console.log(`Servidor express escuchando en el puerto ${getArgs_1.portArgument} - PID WORKER ${process.pid}`));
}
