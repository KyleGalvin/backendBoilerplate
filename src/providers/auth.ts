import * as path from "path";
import * as jwt from "jsonwebtoken";

import {User, IUser} from "../models/user";
import config from "../config";
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

    const payload = {
      "id": user.id,
      "iss": config.jwt.issuer,
      "sub": user.username = "@" + config.domain
    };
    logger.debug({"obj": payload}, "signing jwt payload");

    const jwtSignOptions: jwt.SignOptions = {
      "expiresIn": 1440 // expires in 24 hours
    };
    return jwt.sign(payload, config.jwt.secret, jwtSignOptions);
  }

}
