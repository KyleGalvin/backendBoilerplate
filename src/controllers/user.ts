import * as express from "express";
import {Post, Get, Route, Body, Security, Delete, Put} from "tsoa";
import {Inject} from "typescript-ioc";

import {config} from "../config";
import {UserProvider} from "../providers/user";
import {IUserProvider} from "../providers/IUserProvider";
import {UserFactory} from "../factories/user";
import {AuthProvider, IAccessToken} from "../providers/auth";
import {IAuthProvider} from "../providers/IAuthProvider";
import {IUserCredentials} from "../models/entities/user";
import {IUserSerialized} from "../models/entities/IUserSerialized";
import {ISignupResponse} from "../models/entities/ISignupResponse";

@Route("user")
export class UserController {

  @Inject
  private userProvider!: IUserProvider;
  @Inject
  private authProvider!: IAuthProvider;

  @Post("")
  @Security("jwt", ["user"])
  public async update(@Body() user: IUserSerialized): Promise<IUserSerialized> {
    const updatedUser = await this.userProvider.update(user);
    return IUserProvider.serialize(updatedUser);
  }

  @Get("/{id}")
  @Security("jwt", ["user"])
  public async read(id: number): Promise<IUserSerialized> {
    const user = await this.userProvider.getById(id);
    return IUserProvider.serialize(user);
  }

  @Delete("/{id}")
  @Security("jwt", ["user"])
  public async delete(id: number): Promise<void> {
    await this.userProvider.deleteById(id);
  }

  @Put("signup")
  public async signup(@Body() user: IUserSerialized): Promise<ISignupResponse> {
    try {
      const userData = await this.userProvider.create(user);
      const jwt = await this.authProvider.login(userData.username, user.password);
      return {
          "authToken": jwt as string,
          "user": userData
        };
    } catch (e) {
      throw e;
    }
  }

  @Put("login")
  public async login(@Body() credentials: IUserCredentials): Promise<ISignupResponse> {
    const jwt = await this.authProvider.login(credentials.username, credentials.password);
    if (!jwt) {
      throw new Error("Login Error");
    }
    const userId = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString()).id;
    const userData = await this.userProvider.getById(userId);
    return {
      "authToken": jwt as string,
      "user": userData
    };
  }
}
