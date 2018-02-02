import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Multer from "multer";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import { Connection, Repository } from "typeorm";
import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Security } from "tsoa";

import {UserProvider, IUserProvider} from "../providers/user";
import {AuthProvider, IAuthProvider, IAccessToken} from "../providers/auth";
import {UserFactory} from "../factories/user";
import {Logger} from "../util/logger";
import {IUserSerialized, IUserCredentials, IUser, User} from "../models/entities/user";
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
      ], this.signupExpress.bind(this));

    this.router.post("/auth/login", [
      multer.any(),
      check("username", "Invalid Usename").isLength({"min": 3}),
      check("password", "Password too short").isLength({"min": 3})
    ], this.loginExpress.bind(this));
  }

  
  public async signupExpress(req: express.Request, res: express.Response): Promise<express.Response> {
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

    return res.json(this.signup(user));
  }

  @Post("signup")
  private async signup(@Body() user: IUserSerialized): Promise<IAccessToken> {
    if (this.connection === null) {
      throw new Error("Database Unavailable");
    }

    try {
      const result = await this.userProvider.create(user, user.password);
      if (!result) {
        throw new Error("Username Unavailable");
      }

      const jwt = await this.authProvider.login((result as User).username, user.password);
      if (!jwt) {
        throw new Error("Login Error");
      }

      return {"access_token": jwt};

    } catch (e) {
      logger.error({"obj": e}, "error");
      throw new Error("Unknown Error");
    }
  }

  public async loginExpress(req: express.Request, res: express.Response): Promise<express.Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ "errors": errors.mapped() });
    }
    const formData = matchedData(req);
    const user: IUserCredentials = {
      "username": formData.username as string,
      "password": formData.password as string
    };

    return await res.json(this.login(user));
  }

  @Post("login")
  public async login( @Body() credentials: IUserCredentials): Promise<IAccessToken> {
    if (this.connection === null) {
      throw new Error("Database Unavailable");
    }

    try {
      const jwt = await this.authProvider.login(credentials.username, credentials.password);
      if (!jwt) {
        throw new Error("Login Error");
      }

      return {"access_token": jwt};

    } catch (e) {
      throw new Error("Unknown Error");
    }
  }
}
