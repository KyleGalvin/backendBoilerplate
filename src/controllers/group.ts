import * as path from "path";
import {Inject} from "typescript-ioc";
import * as Hapi from "hapi";

import {Logger} from "../util/logger";
import {IConfig, config} from "../config";
import {Group, IGroupSerialized} from "../models/entities/group";
import {IGroup} from "../models/entities/IGroup";
import {IUserProvider} from "../providers/IUserProvider";
import {IGroupProvider} from "../providers/IGroupProvider";
import jwtToId from "../util/jwt";

const logger = Logger(path.basename(__filename));

export class GroupController {

  @Inject
  private groupProvider!: IGroupProvider;
  @Inject
  private userProvider!: IUserProvider;

  public async saveGroup(userId: number, group: IGroupSerialized) {
    const user = await this.userProvider.getById(userId);
    if (user) {
      // create group record
      const groupData: IGroupSerialized = {
        "id": 0,
        "name": group.name,
        "owner": userId,
        "users": group.users
      };
      const savedGroup = await this.groupProvider.create(groupData);
      return IGroupProvider.serialize(savedGroup);
    } else {
      throw new Error("Not authenticated");
    }
  }

  public async getGroups(userId: number) {
    // get user record from jwt userId
    const user = await this.userProvider.getById(userId);
    if (user) {
      return user.groups.map((g) => IGroupProvider.serialize(g));
    } else {
      throw new Error("Not authenticated");
    }
  }
  public async deleteById(userId: number) {
    await this.groupProvider.deleteById(userId);
  }

  public async update(group: IGroupSerialized) {
    const updatedGroup = await this.groupProvider.update(group);
    return IGroupProvider.serialize(updatedGroup);
  }
}
