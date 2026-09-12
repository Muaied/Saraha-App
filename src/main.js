import express from "express";
const app = express();
import cors from "cors";
// import crypto from "crypto";
// console.log(crypto.randomBytes(16).toString("hex").length);

import {
  authenticationController
} from "./modules/index.js";
import { connectDB } from "./DB/db.js";
import { globalErrorHandling } from "./middleware/error.middleware.js";
import { PORT } from "./config.js";
// import { decryption, encryption } from "./common/security/encryption.security.js";
// const encValue = await encryption("muaied");
// const plain = decryption(encValue)
// console.log({ encValue, plain });


//DB connection
connectDB(app, PORT);

//appliction-level-middleware
app.use(cors(), express.json());
//appliction routing
app.get("/", async (req, res, next) => {
  return res.json({ message: "welcome to my API" });
});
app.use("/auth", authenticationController);

app.all("{/*dummy}", (req, res, next) => {
  return res.status(404).json({ message: "Invalid application routing" });
});
app.use(globalErrorHandling);

