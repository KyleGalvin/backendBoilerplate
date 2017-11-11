import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Multer from "multer";

import {UserProvider} from "../providers/user";
import {AuthProvider} from "../providers/auth";
import Logger from "../util/logger";
import Connection from "../models/typeorm";
import {IUserSerialized} from "../models/user";

const logger = Logger(path.basename(__filename));
const multer = Multer();

const router = express.Router();
router.post("/auth/signup", multer.any(), async (req, res) => {
  try{
    const formData = JSON.parse(req.body.json);
    logger.info({"obj": [req.body]}, "signup hit");
    const validated = (
      typeof(formData.username) === "string" && formData.username.length > 0 &&
      typeof(formData.email) === "string" && formData.email.length > 0 &&
      typeof(formData.firstName) === "string" && formData.firstName.length > 0 &&
      typeof(formData.lastName) === "string" && formData.lastName.length > 0 &&
      typeof(formData.password) === "string" && formData.password.length > 0
    );

    if (!validated) {
      return res.json({"error": "incomplete user form"});
    }

    const user: IUserSerialized = {
      "username": formData.username as string,
      "email": formData.email as string,
      "firstName": formData.firstName as string,
      "lastName": formData.lastName as string
    } as IUserSerialized;
    const password = formData.password as string;
    const connection = await Connection;
    const userProvider = new UserProvider(connection);
    const authProvider = new AuthProvider();

    logger.info({"obj": [password]}, "creating user");
    const result = await userProvider.create(user, password);

    if (!result) {
      // error or username taken
      return res.json({"error": "error or username taken"});
    }
    logger.info("logging in");
    const jwt = await authProvider.login((result as IUserSerialized).username, password);
    logger.info("got jwt signed");
    if (!jwt) {
      // error
      return res.json({"error": "error logging in"});
    }

    logger.info("responding");
    return res.json({"token": jwt});

  } catch (e) {
    logger.info({"obj": e}, "error");
    return res.json({"error": e})
  }
});

export default router;
