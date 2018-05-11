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
      "handler": (request) => this.update(request.payload as IUserSerialized)
    });
    server.route({
      "method": "GET",
      "path": "/{id}",
      "handler": (request) => this.read(parseInt(request.params.id, 10))
    });
    server.route({
      "method": "DELETE",
      "path": "/{id}",
      "handler": (request) => this.delete(parseInt(request.params.id, 10))
    });
    server.route({
      "method": "PUT",
      "path": "/signup",
      "handler": (request) => this.signup(request.payload as IUserSerialized)
    });
    server.route({
      "method": "PUT",
      "path": "/login",
      "handler": (request) => this.login(request.payload as IUserCredentials)
    });
  }

  public async update(userRequest: IUserSerialized) {
    const updatedUser = await this.userProvider.update(userRequest);
    return IUserProvider.serialize(updatedUser);
  }

  public async read(userId: number) {
    const user = await this.userProvider.getById(userId);
    return IUserProvider.serialize(user);
  }

  public async delete(userId: number) {
    await this.userProvider.deleteById(userId);
  }

  public async signup(userRequest: IUserSerialized) {
    try {
      const userData = await this.userProvider.create(userRequest);
      const userDataSerialized = IUserProvider.serialize(userData);
      const jwt = await this.authProvider.login(userData.username, userRequest.password);
      return {
          "authToken": jwt as string,
          "user": userDataSerialized
        };
    } catch (e) {
      throw e;
    }
  }

  public async login(credentials: IUserCredentials) {
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
