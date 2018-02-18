import * as path from "path";
import {Put, Route, Body} from "tsoa";
import {Inject} from "typescript-ioc";

import {UserProvider, IUserProvider} from "../providers/user";
import {AuthProvider, IAuthProvider, IAccessToken} from "../providers/auth";
import {Logger} from "../util/logger";
import {IUserSerialized, IUserCredentials, IUser} from "../models/entities/user";
import {config} from "../config";

const logger = Logger(path.basename(__filename));

@Route("auth")
export class AuthController {

  @Inject
  private userProvider!: IUserProvider;
  @Inject
  private authProvider!: IAuthProvider;

  @Put("signup")
  public async signup(@Body() user: IUserSerialized): Promise<IAccessToken> {
    try {
      const result = await this.userProvider.create(user);
      if (!result) {
        throw new Error("Username Unavailable");
      }

      const jwt = await this.authProvider.login((result as IUser).username, user.password);
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
  public async login(@Body() credentials: IUserCredentials): Promise<IAccessToken> {
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
