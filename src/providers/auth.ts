import * as path from "path";
import * as jwt from "jsonwebtoken";

import {User, IUser} from "../models/entities/user";
import { IConfig } from "../config";
import { Repository } from "typeorm";
import {ILogger, Logger} from "../util/logger";

const logger: ILogger = Logger(path.basename(__filename));

export interface IAuthProvider {
  login: (username: string, password: string) => Promise<string | null>;
}

export interface IAccessToken {
  access_token: string;
}

export class AuthProvider implements IAuthProvider {

  private config: IConfig;
  private userRepository: Repository<User>;

  public constructor(config: IConfig, userRepository: Repository<User>) {
    this.config = config;
    this.userRepository = userRepository;
  }

  public async login(username: string, password: string) {
    const user = await this.userRepository.findOne({"username": username});

    if (!user) {
      return null;
    }

    if (await (user as IUser).verifyPassword(password)) {
      return this.forgeToken( user );
    } else {
      return null;
    }
  }

  private forgeToken(user: IUser) {

    const payload = {
      "id": user.id,
      "iss": this.config.jwt.issuer,
      "sub": user.username = "@" + this.config.domain
    };
    logger.debug({"obj": payload}, "signing jwt payload");

    const jwtSignOptions: jwt.SignOptions = {
      "expiresIn": 1440 // expires in 24 hours
    };
    return jwt.sign(payload, this.config.jwt.secret, jwtSignOptions);
  }

}
