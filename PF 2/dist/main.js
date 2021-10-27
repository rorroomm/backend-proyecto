"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var factory_1 = require("./factory");
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var socketIo = __importStar(require("socket.io"));
//Configuracion de Server y Routers
var admin = true;
var port = 8080;
var app = (0, express_1.default)();
var routerProductos = express_1.default.Router();
var routerCarrito = express_1.default.Router();
var __dirname = path_1.default.resolve();
app.use(express_1.default.static(__dirname + "/src/public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
var server = app.listen(port, function () {
    console.log("Server listen on port " + port);
});
server.on("error", function (error) {
    console.log(error);
});
app.use("/productos", routerProductos);
app.use("/carrito", routerCarrito);
//Factory - Seleccion de DAO
var FileSystemDao = 1;
var MySqlDao = 2;
var SqlDao = 3;
var MongoDbDao = 4;
var MongoDbaaSDao = 5;
var FirebaseDao = 6;
var daoFactory = new factory_1.DaoFactory();
var dao = daoFactory.getDao(FileSystemDao);
//Configurar Websocket
var io = new socketIo.Server(server);
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/\u00B4src/public/index.html");
});
app.get("/carrito", function (request, response) {
    response.sendFile(__dirname + "/src/public/html/carrito.html");
});
var messages = [
    {
        author: " ",
        date: " ",
        text: " ",
    },
];
io.on("connection", function (socket) {
    var productosTemplate = dao.getProducts();
    socket.emit("cargarProducto", productosTemplate);
    console.log("Conectado");
    var cartTemplate = dao.getProducts();
    socket.emit("agregarCarrito", cartTemplate);
    console.log("Conectado");
    socket.emit("messages", messages);
    socket.on("new-message", function (data) {
        messages.push(data);
        io.sockets.emit("messages", messages);
    });
});
//RUTAS ROUTER PRODUCTOS
//GET - Lista Productos
routerProductos.get("/listar", function (request, response) {
    var result = dao.getProducts();
    if (result !== undefined) {
        response.status(200).send(JSON.stringify(result));
    }
    else {
        response.status(404).send({ error: "No hay productos cargados" });
    }
});
//GET - Lista Productos por ID
routerProductos.get("/listar/:id", function (request, response) {
    var id = request.params.id;
    var result = dao.getProductById(Number(id));
    if (result == null) {
        response.status(404).send("Producto no encontrado");
    }
    response.status(200).send(JSON.stringify(result));
});
//POST - Agrega un Producto
routerProductos.post("/guardar", function (request, response) {
    if (admin) {
        var product = request.body;
        var productosTemplate = dao.getProducts();
        dao.insertProduct(product);
        io.sockets.emit("cargarProducto", productosTemplate);
        response.redirect("/");
    }
    else {
        response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
    }
});
//PUT - Actualiza un Producto
routerProductos.put("/actualizar/:id", function (request, response) {
    var date = new Date();
    var templateDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " ";
    if (admin) {
        var id = request.params.id;
        var productBody = request.body;
        var newProduct = __assign(__assign({}, productBody), { id: id, templateDate: templateDate });
        dao.updateProduct(productBody, Number(id));
        response.send(newProduct);
    }
    else {
        response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
    }
});
//DELETE - Elimina un Producto por ID
routerProductos.delete("/borrar/:id", function (request, response) {
    var index = request.params.id;
    var deletedObject = dao.getProductById(Number(index));
    dao.deleteProduct(Number(index));
    response.status(200).send(deletedObject);
});
//RUTAS ROUTER CARRITO
//GET - Lista Productos
routerCarrito.get("/listar", function (request, response) {
    var result = dao.getProducts();
    if (result !== undefined) {
        response.status(200).send(JSON.stringify(result));
    }
    else {
        response.status(404).send({ error: "No hay productos cargados" });
    }
});
//GET - Lista Productos por ID
routerCarrito.get("/listar/:id", function (request, response) {
    var id = request.params.id;
    var result = dao.getProductById(Number(id));
    if (result == null) {
        response.status(404).send("Producto no encontrado");
    }
    response.status(200).send(JSON.stringify(result));
});
//POST - Agrega un Producto
routerCarrito.post("/guardar", function (request, response) {
    if (admin) {
        var product = request.body;
        var productosTemplate = dao.getProducts();
        dao.insertProduct(product);
        io.sockets.emit("cargarProducto", productosTemplate);
        response.redirect("/");
    }
    else {
        response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
    }
});
//PUT - Actualiza un Producto
routerCarrito.put("/actualizar/:id", function (request, response) {
    var date = new Date();
    var templateDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " ";
    if (admin) {
        var id = request.params.id;
        var productBody = request.body;
        var newProduct = __assign(__assign({}, productBody), { id: id, templateDate: templateDate });
        dao.updateProduct(productBody, Number(id));
        response.send(newProduct);
    }
    else {
        response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
    }
});
//DELETE - Elimina un Producto por ID
routerCarrito.delete("/borrar/:id", function (request, response) {
    var index = request.params.id;
    var deletedObject = dao.getProductById(Number(index));
    dao.deleteProduct(Number(index));
    response.status(200).send(deletedObject);
});
