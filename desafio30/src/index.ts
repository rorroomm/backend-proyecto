import myServer from "./services/server";
import { dbConnection } from "./db/mongoDB";
import { initWsServer } from "./services/sockets";
import cluster from "cluster";
import os from "os";
import { portArgument, clusterArg } from "./utils/getArgs";

dbConnection();
initWsServer(myServer);

const port = portArgument;
const clusterArgument = clusterArg || false;
const numCPUs = os.cpus().length;

if (cluster.isMaster && clusterArgument) {
  console.log(`NUMERO DE CPUS ===> ${numCPUs}`);
  console.log(`PID MASTER ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker: any) => {
    console.log(`Worker ${worker.process.pid} died at ${Date()}`);
    cluster.fork();
  });
} else {
  myServer.listen(portArgument, () =>
    console.log(
      `Servidor express escuchando en el puerto ${portArgument} - PID WORKER ${process.pid}`
    )
  );
}
