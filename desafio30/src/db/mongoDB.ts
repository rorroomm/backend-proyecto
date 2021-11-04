import mongoose from "mongoose";

export async function dbConnection() {
  try {
    const URLhost =
      "mongodb+srv://rogerkpo666:<password>@cluster0.7kscg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    let connection = await mongoose.connect(URLhost);
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
  }
}
