import * as jwt from "jsonwebtoken";

import {User, IUser} from "../models/user";
import config from "../config/local";
import Connection from "../models/typeorm";

export interface IAuthProvider {
  login: (username: string, password: string) => string;
}

export class AuthProvider {

  public async login(username: string, password: string) {
    const connection  = await Connection;
    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({"username": username});

    if ( !user ) {
      return null;
    }

    if ( await (user as User).verifyPassword(password) ) {
      return this.forgeToken( user );
    } else {
      return null;
    }

    // logout method? or is that entirely client side?
  }

  private forgeToken(user: IUser) {

    console.log("need to build payload");
    const payload = {
     // admin: user.admin
    };

    const jwtSignOptions: jwt.SignOptions = {
      "expiresIn": 1440 // expires in 24 hours
    };
    return jwt.sign(payload, config.jwtSecret, jwtSignOptions);
  }

}
