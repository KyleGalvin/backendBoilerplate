import * as path from "path";
import {Inject} from "typescript-ioc";
import {Get, Put, Route, Body, Query, Header, Request, Security, Delete, Post } from "tsoa";

import { Logger } from "../util/logger";
import { IConfig, config } from "../config";
import { IGroup, Group, IGroupSerialized } from "../models/entities/group";
import { UserProvider, IUserProvider } from "../providers/user";
import { GroupProvider, IGroupProvider } from "../providers/group";

const logger = Logger(path.basename(__filename));

@Route("group")
export class GroupController {

  @Inject
  private groupProvider!: IGroupProvider;
  @Inject
  private userProvider!: IUserProvider;

  @Post("")
  @Security("jwt", ["user"])
  public async update(@Body() group: IGroupSerialized): Promise<IGroupSerialized> {
    const updatedGroup = await this.groupProvider.update(group);
    return GroupProvider.serialize(updatedGroup);
  }

  @Put("")
  @Security("jwt", ["user"])
  public async create(@Request() request: Express.Request, @Body() group: IGroupSerialized): Promise<IGroupSerialized> {
    const user = await this.userProvider.getById(request.user.userId);
    if (user) {
      // create group record
      const groupData: IGroupSerialized = {
        "id": 0,
        "name": group.name,
        "owner": request.user.userId,
        "users": group.users
      };
      const savedGroup = await this.groupProvider.create(groupData);
      return GroupProvider.serialize(savedGroup);
    } else {
      throw new Error("Not authenticated");
    }
  }

  @Get("")
  public async read(@Request() request: Express.Request): Promise<IGroupSerialized[]> {
    // get user record from jwt userId
    const user = await this.userProvider.getById(request.user.userId);
    if (user) {
      return user.groups.map(g => GroupProvider.serialize(g));
    } else {
      throw new Error("Not authenticated");
    }
  }

  @Delete("/{id}")
  @Security("jwt", ["user"])
  public async delete(id: number): Promise<IGroupSerialized> {
    const group = await this.groupProvider.deleteById(id);
    return GroupProvider.serialize(group);
  }

}
