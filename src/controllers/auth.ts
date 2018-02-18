import * as path from "path";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as Multer from "multer";
import { Connection, Repository } from "typeorm";
import {Get, Put, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Security } from "tsoa";
import {AutoWired, Inject} from "typescript-ioc";

import {UserProvider, IUserProvider} from "../providers/user";
import {AuthProvider, IAuthProvider, IAccessToken} from "../providers/auth";
import {Logger} from "../util/logger";
import {IUserSerialized, IUserCredentials, IUser, User} from "../models/entities/user";
import {config} from "../config";
import { Exception } from "typemoq/Error/_all";

const logger = Logger(path.basename(__filename));
const multer = Multer();

@Route("auth")
export class AuthController {

  @Inject
  private userProvider!: IUserProvider;
  @Inject
  private authProvider!: IAuthProvider;

  @Put("signup")
  public async signup(@Body() user: IUserSerialized): Promise<IAccessToken> {
    logger.info("signup1");
    try {
      const result = await this.userProvider.create(user);
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

  @Put("login")
  public async login( @Body() credentials: IUserCredentials): Promise<IAccessToken> {
    logger.info("login");
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
