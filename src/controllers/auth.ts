import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Multer from "multer";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import { Connection, Repository } from "typeorm";
import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request } from "tsoa";

import {UserProvider, IUserProvider} from "../providers/user";
import {AuthProvider, IAuthProvider} from "../providers/auth";
import {UserFactory} from "../factories/user";
import {Logger} from "../util/logger";
import {IUserSerialized, IUser, User} from "../models/entities/user";
import {config} from "../config";

const logger = Logger(path.basename(__filename));
const multer = Multer();

@Route("auth")
export default class AuthController {

  public router: express.Router;
  private connection: Connection;
  private userFactory: UserFactory;
  private userRepository: Repository<User>;
  private userProvider: IUserProvider;
  private authProvider: IAuthProvider;

  public constructor (connection: Connection, userRepository: Repository<User>) {
    this.router = express.Router();
    this.connection = connection;
    this.userFactory = new UserFactory();
    this.userRepository = userRepository;
    this.userProvider = new UserProvider(connection, this.userFactory);
    this.authProvider = new AuthProvider(config, this.userRepository);

    this.router.post("/auth/signup", [
      multer.any(),
      check("username", "Invalid Usename").isLength({"min": 3}),
      check("email", "Invalid Email").isEmail(),
      check("firstName", "Empty FirstName").isLength({"min": 1}),
      check("lastName", "Empty LastName").isLength({"min": 1}),
      check("password", "Password too short").isLength({"min": 3})
      ], this.signup.bind(this));

    this.router.post("/auth/login", [
      multer.any(),
      check("username", "Invalid Usename").isLength({"min": 3}),
      check("password", "Password too short").isLength({"min": 3})
    ], this.login.bind(this));
  }


  @Post("signup")
  public async signup( @Request() req: express.Request, res: express.Response): Promise<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ "errors": errors.mapped() });
    }
    const formData = matchedData(req);

    const user: IUserSerialized = {
      "username": formData.username as string,
      "email": formData.email as string,
      "firstName": formData.firstName as string,
      "lastName": formData.lastName as string,
      "password": formData.password as string
    } as IUserSerialized;

    if (this.connection === null) {
      return res.status(422).json({"error": "Database Unavailable"});
    }

    try {
      const result = await this.userProvider.create(user, user.password);
      if (!result) {
        return res.status(422).json({"error": "Username Unavailable"});
      }

      const jwt = await this.authProvider.login((result as User).username, user.password);
      if (!jwt) {
        return res.status(422).json({"error": "Login Error"});
      }

      return res.json({"access_token": jwt});

    } catch (e) {
      logger.error({"obj": e}, "error");
      return res.status(422).json({"error": "Unknown Error"});
    }
  }

  public async login( @Request() req: express.Request, res: express.Response): Promise<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ "errors": errors.mapped() });
    }
    const formData = matchedData(req);

    if (this.connection === null) {
      return res.status(422).json({"error": "Database Unavailable"});
    }

    try {
      const jwt = await this.authProvider.login(formData.username, formData.password);
      if (!jwt) {
        return res.status(422).json({"error": "Login Error"});
      }

      return res.json({"access_token": jwt});

    } catch (e) {
      logger.error({"obj": e}, "error");
      return res.status(422).json({"error": "Unknown Error"});
    }
  }
}
