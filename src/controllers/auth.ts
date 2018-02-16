import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Multer from "multer";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import { Connection, Repository } from "typeorm";
import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Security } from "tsoa";
import {AutoWired, Inject} from "typescript-ioc";

import {UserProvider, IUserProvider} from "../providers/user";
import {AuthProvider, IAuthProvider, IAccessToken} from "../providers/auth";
import {UserFactory} from "../factories/user";
import {Logger} from "../util/logger";
import {IUserSerialized, IUserCredentials, IUser, User} from "../models/entities/user";
import {config} from "../config";
import { Exception } from "typemoq/Error/_all";

const logger = Logger(path.basename(__filename));
const multer = Multer();

@Route("auth")
export class AuthController {

  public router: express.Router;
  @Inject
  private connection: Connection;
  private userFactory: UserFactory;
  @Inject
  private userRepository: Repository<User>;
  @Inject
  private userProvider: IUserProvider;
  @Inject
  private authProvider: IAuthProvider;

  public constructor () {
    this.userFactory = new UserFactory();
  }

  @Post("signup")
  public async signup(@Body() user: IUserSerialized): Promise<IAccessToken> {
    logger.info("signup1");
    if (this.connection === null) {
      throw new Error("Database Unavailable");
    }
    logger.info({"obj": this.userProvider}, "signup2");
    try {
      const result = await this.userProvider.create(user);
      logger.info({"obj": result},"signup3");
      if (!result) {
        throw new Error("Username Unavailable");
      }

      const jwt = await this.authProvider.login((result as User).username, user.password);
      logger.info("signup4");
      if (!jwt) {
        throw new Error("Login Error");
      }

      return {"access_token": jwt};

    } catch (e) {
      logger.error({"obj": e}, "error");
      throw new Error("Unknown Error");
    }
  }

  @Post("login")
  public async login( @Body() credentials: IUserCredentials): Promise<IAccessToken> {
    logger.info("login");
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
