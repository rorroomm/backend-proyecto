"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http = __importStar(require("http"));
const index_1 = __importDefault(require("../routes/index"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const StoreOptions = {
    store: connect_mongo_1.default.create({
        mongoUrl: "mongodb+srv://jpagnat:asdasd@cluster0.f7fqu.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: "asdasasdasfas",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000,
    },
};
const app = express_1.default();
const publicFolderPath = path_1.default.resolve(__dirname, "../../public");
app.use(express_1.default.static(publicFolderPath));
const layoutsFolderPath = path_1.default.resolve(__dirname, "../../views/layouts");
const defaultLayerPth = path_1.default.resolve(__dirname, "../../views/layouts/index.hbs");
const partialsFolderPath = path_1.default.resolve(__dirname, "../../views/partials");
app.set("view engine", "hbs");
app.engine("hbs", express_handlebars_1.default({
    extname: "hbs",
    layoutsDir: layoutsFolderPath,
    partialsDir: partialsFolderPath,
    defaultLayout: defaultLayerPth,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use(cookie_parser_1.default());
app.use(express_session_1.default(StoreOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api", index_1.default);
const myServer = new http.Server(app);
exports.default = myServer;
