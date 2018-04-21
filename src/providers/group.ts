import * as path from "path";
import {Provides, Inject} from "typescript-ioc";
import {Repository, Connection} from "typeorm";

import {Group, IGroupSerialized} from "../models/entities/group";
import {IGroup} from "../models/entities/IGroup";
import {User} from "../models/entities/user";
import {IUser} from "../models/entities/IUser";
import {IUserSerialized} from "../models/entities/IUserSerialized";
import {GroupFactory} from "../factories/group";
import {IConfig, config} from "../config";
import {ILogger, Logger} from "../util/logger";
import {UserController} from "../controllers/user";
import {UserProvider} from "./user";
import {IUserProvider} from "./IUserProvider";
import {IGroupProvider} from "./IGroupProvider";

const logger: ILogger = Logger(path.basename(__filename));

export class GroupProvider implements IGroupProvider {

  @Inject
  private connection!: Connection;
  @Inject
  private userProvider!: IUserProvider;
  @Inject
  private groupFactory!: GroupFactory;

  private config: IConfig;
  private groupRepository: Repository<Group>;

  public constructor() {
    this.config = config;
    this.groupRepository = this.connection.getRepository(Group);
  }

  public async create(groupData: IGroupSerialized) {

    logger.debug({"obj": groupData}, "Creating new group: ");

    const group = await this.groupFactory.Create(groupData);

    try {
      await this.groupRepository.save(group);
      logger.debug("New group created");
      return group;
    } catch (e) {
      logger.info({"obj": e}, "Error saving group");
      throw new Error("Error saving group");
    }
  }

  public async update(groupData: IGroupSerialized) {
    const group = await this.groupRepository.findOne(groupData.id);
    if (group === undefined) {
      throw new Error("Group does not exist");
    }

    group.name = groupData.name;
    group.users = await Promise.all(
        groupData.users
        .filter((u) => u.id !== undefined)
        .map(async (u) => await this.userProvider.getById(u.id as number))
      );
    return await this.groupRepository.save(group);

  }

  // get group
  public get() {
    return this.groupRepository.find();
  }

  public getById(id: number) {
    return this.groupRepository.findOne(id);
  }

  public getByOwnerId(id: number) {
    return this.groupRepository.find({"owner": id });
  }

  // delete group
  public async deleteById(id: number) {
    return await this.groupRepository.delete(id);
  }
}
