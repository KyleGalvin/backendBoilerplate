import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Multer from "multer";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";

import {UserProvider} from "../providers/user";
import {AuthProvider} from "../providers/auth";
import Logger from "../util/logger";
import Connection from "../models/typeorm";
import {IUserSerialized} from "../models/user";

const logger = Logger(path.basename(__filename));
const multer = Multer();

const router = express.Router();
router.post("/auth/signup", [
  multer.any(),
  check("username", "Invalid Usename").isLength({min: 3}),
  check("email", "Invalid Email").isEmail(),
  check("firstName", "Empty FirstName").isLength({min: 1}),
  check("lastName", "Empty LastName").isLength({min: 1}),
  check("password", "Password too short").isLength({min:3})
  ], 
  async (req: express.Request, res: express.Response) => {
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
      }
      const formData = matchedData(req);

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
  }
);

export default router;
