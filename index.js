import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes.js";
import path from "path";

console.log("app starting...");
const app = express();

//middleware setup
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // Anti hacking 90% trick

app.use(router);
const directoryPath = path.resolve("../scripts/scrap_data/");
app.use("/uploads", express.static(directoryPath));
app.use("/src", express.static("./src"));

const port = 8080;

try {
  app.listen(port, () => {
    console.log(`server started at http://127.0.0.1:${port}`);
  });
} catch (error) {
  console.log("Cannot connect to the server");
  console.log(error);
}
