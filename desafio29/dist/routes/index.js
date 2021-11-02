"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsRoutes_1 = __importDefault(require("./productsRoutes"));
const cartRoutes_1 = __importDefault(require("./cartRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const auth_1 = require("../middlewares/auth");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const numCPUs = os_1.default.cpus().length;
const router = express_1.Router();
const scriptPath = path_1.default.resolve(__dirname, "../utils/randoms");
router.use("/products", auth_1.isLoggedIn, productsRoutes_1.default);
router.use("/cart", cartRoutes_1.default);
router.use("/", userRoutes_1.default);
router.get("/info", (req, res) => {
    res.json({
        arguments: process.argv,
        plataform: process.platform,
        nodeVersion: process.version,
        directory: process.cwd(),
        processId: process.pid,
        memoryUse: process.memoryUsage(),
        CPUs: numCPUs,
    });
});
router.get("/randoms", (req, res) => {
    let numeros;
    req.query.cant ? (numeros = Number(req.query.cant)) : 100000000;
    const randoms = child_process_1.fork(scriptPath);
    const msg = { command: "start", cantidad: numeros };
    randoms.send(JSON.stringify(msg));
    randoms.on("message", (result) => {
        res.json(result);
    });
});
exports.default = router;
