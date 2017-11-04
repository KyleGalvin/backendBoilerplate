import * as path from "path";
import * as jwt from "jsonwebtoken";

import {User, IUser} from "../models/user";
import config from "../config/local";
import Connection from "../models/typeorm";
import Logger from "../util/logger";

const logger = Logger(path.basename(__filename));

export interface IAuthProvider {
  login: (username: string, password: string) => string;
}

export class AuthProvider {

  public async login(username: string, password: string) {
    const connection  = await Connection;
    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({"username": username});

    if (!user) {
      return null;
    }

    if (await (user as User).verifyPassword(password)) {
      return this.forgeToken( user );
    } else {
      return null;
    }
  }

  private forgeToken(user: IUser) {

    logger.info("need to build payload");
    const payload = {
      "id": user.id,
      "iss": config.jwt.issuer,
      "exp": (Date.now() / 1000) + config.jwt.duration, 
      "username": user.username
    };

    const jwtSignOptions: jwt.SignOptions = {
      "expiresIn": 1440 // expires in 24 hours
    };
    return jwt.sign(payload, config.jwt.secret, jwtSignOptions);
  }

}
