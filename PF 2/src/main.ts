import { DaoFactory } from "./factory";
import { IDao } from "./interface/daos/IDao";
import express, { Request, Response } from "express";
import path from "path";
import * as socketIo from "socket.io";

//Configuracion de Server y Routers
const admin: boolean = true;
const port = 8080;
const app = express();
const routerProductos = express.Router();
const routerCarrito = express.Router();
const __dirname = path.resolve();
app.use(express.static(`${__dirname}/src/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
server.on("error", (error: any) => {
  console.log(error);
});
app.use("/productos", routerProductos);
app.use("/carrito", routerCarrito);

//Factory - Seleccion de DAO
const FileSystemDao = 1;
const MySqlDao = 2;
const SqlDao = 3;
const MongoDbDao = 4;
const MongoDbaaSDao = 5;
const FirebaseDao = 6;

const daoFactory = new DaoFactory();
const dao: IDao = daoFactory.getDao(FileSystemDao);

//Configurar Websocket
const io = new socketIo.Server(server);
app.get("/", (request: Request, response: Response) => {
  response.sendFile(`${__dirname}/´src/public/index.html`);
});

app.get("/carrito", (request: Request, response: Response) => {
  response.sendFile(`${__dirname}/src/public/html/carrito.html`);
});

interface Message {
  author: string;
  date: string;
  text: string;
}

const messages: Array<Message> = [
  {
    author: " ",
    date: " ",
    text: " ",
  },
];

io.on("connection", (socket: any) => {
  const productosTemplate = dao.getProducts();
  socket.emit("cargarProducto", productosTemplate);
  console.log("Conectado");

  const cartTemplate = dao.getProducts();
  socket.emit("agregarCarrito", cartTemplate);
  console.log("Conectado");

  socket.emit("messages", messages);

  socket.on("new-message", (data: any) => {
    messages.push(data);
    io.sockets.emit("messages", messages);
  });
});

//RUTAS ROUTER PRODUCTOS

//GET - Lista Productos
routerProductos.get("/listar", (request: Request, response: Response) => {
  const result = dao.getProducts();
  if (result !== undefined) {
    response.status(200).send(JSON.stringify(result));
  } else {
    response.status(404).send({ error: "No hay productos cargados" });
  }
});

//GET - Lista Productos por ID
routerProductos.get("/listar/:id", (request: Request, response: Response) => {
  const { id } = request.params;
  const result = dao.getProductById(Number(id));
  if (result == null) {
    response.status(404).send("Producto no encontrado");
  }
  response.status(200).send(JSON.stringify(result));
});

//POST - Agrega un Producto
routerProductos.post("/guardar", (request: Request, response: Response) => {
  if (admin) {
    const product = request.body;
    const productosTemplate = dao.getProducts();
    dao.insertProduct(product);
    io.sockets.emit("cargarProducto", productosTemplate);
    response.redirect("/");
  } else {
    response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
  }
});

//PUT - Actualiza un Producto
routerProductos.put(
  "/actualizar/:id",
  (request: Request, response: Response) => {
    const date = new Date();
    const templateDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `;
    if (admin) {
      let id = request.params.id;
      const productBody = request.body;
      const newProduct = { ...productBody, id, templateDate };
      dao.updateProduct(productBody, Number(id));
      response.send(newProduct);
    } else {
      response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
    }
  }
);

//DELETE - Elimina un Producto por ID
routerProductos.delete(
  "/borrar/:id",
  (request: Request, response: Response) => {
    const index = request.params.id;

    const deletedObject = dao.getProductById(Number(index));
    dao.deleteProduct(Number(index));

    response.status(200).send(deletedObject);
  }
);

//RUTAS ROUTER CARRITO

//GET - Lista Productos
routerCarrito.get("/listar", (request: Request, response: Response) => {
  const result = dao.getProducts();
  if (result !== undefined) {
    response.status(200).send(JSON.stringify(result));
  } else {
    response.status(404).send({ error: "No hay productos cargados" });
  }
});

//GET - Lista Productos por ID
routerCarrito.get("/listar/:id", (request: Request, response: Response) => {
  const { id } = request.params;
  const result = dao.getProductById(Number(id));
  if (result == null) {
    response.status(404).send("Producto no encontrado");
  }
  response.status(200).send(JSON.stringify(result));
});

//POST - Agrega un Producto
routerCarrito.post("/guardar", (request: Request, response: Response) => {
  if (admin) {
    const product = request.body;
    const productosTemplate = dao.getProducts();
    dao.insertProduct(product);
    io.sockets.emit("cargarProducto", productosTemplate);
    response.redirect("/");
  } else {
    response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
  }
});

//PUT - Actualiza un Producto
routerCarrito.put("/actualizar/:id", (request: Request, response: Response) => {
  const date = new Date();
  const templateDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `;
  if (admin) {
    let id = request.params.id;
    const productBody = request.body;
    const newProduct = { ...productBody, id, templateDate };
    dao.updateProduct(productBody, Number(id));
    response.send(newProduct);
  } else {
    response.send({ Error: -1, Descripcion: "Ruta no autorizada" });
  }
});

//DELETE - Elimina un Producto por ID
routerCarrito.delete("/borrar/:id", (request: Request, response: Response) => {
  const index = request.params.id;

  const deletedObject = dao.getProductById(Number(index));
  dao.deleteProduct(Number(index));

  response.status(200).send(deletedObject);
});
