import * as express from "express";
import {Inject} from "typescript-ioc";
import * as Hapi from "hapi";

import {config} from "../config";
import {UserProvider} from "../providers/user";
import {IUserProvider} from "../providers/IUserProvider";
import {UserFactory} from "../factories/user";
import {AuthProvider, IAccessToken} from "../providers/auth";
import {IAuthProvider} from "../providers/IAuthProvider";
import {IUserCredentials} from "../models/entities/user";
import {IUserSerialized} from "../models/entities/IUserSerialized";
import {ISignupResponse} from "../models/entities/ISignupResponse";

export class UserController {

  @Inject
  private userProvider!: IUserProvider;
  @Inject
  private authProvider!: IAuthProvider;

  constructor(server: Hapi.Server) {
    server.route({
      "method": "POST",
      "path": "",
      "handler": this.update
    });
    server.route({
      "method": "GET",
      "path": "/{id}",
      "handler": this.read
    });
    server.route({
      "method": "DELETE",
      "path": "/{id}",
      "handler": this.delete
    });
    server.route({
      "method": "PUT",
      "path": "/signup",
      "handler": this.signup
    });
    server.route({
      "method": "PUT",
      "path": "/login",
      "handler": this.login
    });
  }

  public async update(request: Hapi.Request) {
    const updatedUser = await this.userProvider.update(request.payload as IUserSerialized);
    return IUserProvider.serialize(updatedUser);
  }

  public async read(request: Hapi.Request) {
    const user = await this.userProvider.getById(parseInt(request.params.id, 10));
    return IUserProvider.serialize(user);
  }

  public async delete(request: Hapi.Request) {
    await this.userProvider.deleteById(parseInt(request.params.id, 10));
  }

  public async signup(request: Hapi.Request) {
    try {
      const userData = await this.userProvider.create(request.payload as IUserSerialized);
      const userDataSerialized = IUserProvider.serialize(userData);
      const jwt = await this.authProvider.login(userData.username, (request.payload as IUserSerialized).password);
      return {
          "authToken": jwt as string,
          "user": userDataSerialized
        };
    } catch (e) {
      throw e;
    }
  }

  public async login(request: Hapi.Request) {
    const credentials = request.payload as IUserCredentials;
    const jwt = await this.authProvider.login(credentials.username, credentials.password);
    if (!jwt) {
      throw new Error("Login Error");
    }
    const userId = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString()).id;
    const userData = await this.userProvider.getById(userId);
    const userDataSerialized = IUserProvider.serialize(userData);
    return {
      "authToken": jwt as string,
      "user": userDataSerialized
    };
  }
}
