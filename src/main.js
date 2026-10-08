import express from "express";
const app = express();
import cors from "cors";
// import crypto from "crypto";
// console.log(crypto.randomBytes(16).toString("hex").length);

import {
  authenticationController,
  userController
} from "./modules/index.js";
import { connectDB } from "./DB/db.js";
import { globalErrorHandling } from "./middleware/error.middleware.js";
import { PORT } from "./config.js";
import { set } from "./common/services/cache.service.js";
// import { decryption, encryption } from "./common/security/encryption.security.js";
// const encValue = await encryption("muaied");
// const plain = decryption(encValue)
// console.log({ encValue, plain });


//DB connection
await connectDB(app, PORT);

// await set({ key: "name", value: "muaied", ttl: 60 })
await set({ key: "gender", value: { gender: "male" } })

//appliction-level-middleware
app.use(cors(), express.json());

app.use('/assets', express.static('./assets'))

//appliction routing
app.get("/", async (req, res, next) => {
  return res.json({ message: "welcome to my API" });
});
app.use("/auth", authenticationController);
app.use("/user", userController);

app.all("{/*dummy}", (req, res, next) => {
  return res.status(404).json({ message: "Invalid application routing" });
});
app.use(globalErrorHandling);

