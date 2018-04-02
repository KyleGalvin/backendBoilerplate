import * as express from "express";
import {Post, Get, Route, Body} from "tsoa";
import {Inject} from "typescript-ioc";
import {plainToClass, classToPlain} from "class-transformer";

import {config} from "../config";
import {UserProvider, IUserProvider} from "../providers/user";
import {AuthProvider, IAuthProvider, IAccessToken} from "../providers/auth";
import {IUserSerialized, UserSerialized, IUserCredentials, IUser} from "../models/entities/user";

@Route("user")
export class UserController {

  @Inject
  private userProvider!: IUserProvider;
  @Inject
  private authProvider!: IAuthProvider;

  @Post()
  public async update(@Body() user: IUserSerialized): Promise<IUserSerialized> {
    const updatedUser = await this.userProvider.update(user);
    const updatedUserSerialized = classToPlain(updatedUser) as IUserSerialized;
    return updatedUserSerialized;
  }

  @Get()
  public async read(id: number): Promise<IUserSerialized> {
    var user = await this.userProvider.getById(id);
    const userSerialized = classToPlain(user) as IUserSerialized;
    return userSerialized;
  }
}
