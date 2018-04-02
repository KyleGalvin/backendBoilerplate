import * as express from "express";
import {Post, Get, Route, Body, Security, Delete} from "tsoa";
import {Inject} from "typescript-ioc";

import {config} from "../config";
import {UserProvider, IUserProvider} from "../providers/user";
import {UserFactory} from "../factories/user";
import {AuthProvider, IAuthProvider, IAccessToken} from "../providers/auth";
import {IUserSerialized, UserSerialized, IUserCredentials, IUser} from "../models/entities/user";

@Route("user")
export class UserController {

  @Inject
  private userProvider!: IUserProvider;
  @Inject
  private authProvider!: IAuthProvider;

  @Post()
  @Security("jwt", ["user"])
  public async update(@Body() user: IUserSerialized): Promise<IUserSerialized> {
    const updatedUser = await this.userProvider.update(user);
    return UserProvider.serialize(updatedUser);
  }

  @Get()
  @Security("jwt", ["user"])
  public async read(id: number): Promise<IUserSerialized> {
    var user = await this.userProvider.getById(id);
    return UserProvider.serialize(user);
  }

  @Delete()
  @Security("jwt", ["user"])
  public async delete(id: number): Promise<IUserSerialized> {
    var user = await this.userProvider.deleteById(id);
    return UserProvider.serialize(user);
  }
}
