import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Multer from "multer";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";

import {UserProvider} from "../providers/user";
import {AuthProvider} from "../providers/auth";
import {UserFactory} from "../factories/user";
import {Logger} from "../util/logger";
import DBConnection from "../models/typeorm";
import {Connection} from "typeorm";
import {IUserSerialized, IUser, User} from "../models/user";
import {config} from "../config";

const logger = Logger(path.basename(__filename));
const multer = Multer();

const router = express.Router();
router.post("/auth/signup", [
  multer.any(),
  check("username", "Invalid Usename").isLength({"min": 3}),
  check("email", "Invalid Email").isEmail(),
  check("firstName", "Empty FirstName").isLength({"min": 1}),
  check("lastName", "Empty LastName").isLength({"min": 1}),
  check("password", "Password too short").isLength({"min": 3})
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ "errors": errors.mapped() });
    }
    const formData = matchedData(req);

    const user: IUserSerialized = {
      "username": formData.username as string,
      "email": formData.email as string,
      "firstName": formData.firstName as string,
      "lastName": formData.lastName as string
    } as IUserSerialized;
    const password = formData.password as string;

    const connection = await new DBConnection().init() as Connection;
    if(connection === null) {
      return res.status(422).json({"error": "Database Unavailable"});
    }
    const userFactory = new UserFactory();
    const userRepository = await connection.getRepository(User);
    const userProvider = new UserProvider(connection, userFactory);
    const authProvider = new AuthProvider(config, userRepository);

    try {
      const result = await userProvider.create(user, password);
      if (!result) {
        return res.status(422).json({"error": "Username Unavailable"});
      }

      const jwt = await authProvider.login((result as IUserSerialized).username, password);
      if (!jwt) {
        return res.status(422).json({"error": "Login Error"});
      }

      return res.json({"access_token": jwt});

    } catch (e) {
      logger.error({"obj": e}, "error");
      return res.status(422).json({"error": "Unknown Error"});
    }
  }
);

export default router;
