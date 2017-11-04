import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import {UserProvider} from "../providers/user";
import {AuthProvider} from "../providers/auth";
import Logger from "../util/logger";
import Connection from "../models/typeorm";
import {IUserSerialized} from "../models/user";

const logger = Logger(path.basename(__filename));

const router = express.Router();
router.post("/auth/signup", async (req, res) => {

  logger.info("signup hit");

  const user: IUserSerialized = req.query.user;
  const password: string = req.query.password;
  const connection = await Connection;
  const userProvider = new UserProvider(connection);
  const authProvider = new AuthProvider();

  const result = await userProvider.create(user, password);

  if (!result) {
    // error or username taken
    res.json({"error": "error or username taken"});
  }

  const jwt = await authProvider.login((result as IUserSerialized).username, password);

  if (!jwt) {
    // error
    res.json({"error": "error logging in"});
  }

  res.json({"token": jwt});
});

export default router;
