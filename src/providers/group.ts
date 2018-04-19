import * as path from "path";
import {Provides, Inject} from "typescript-ioc";
import { Repository, Connection } from "typeorm";

import { Group, IGroup, IGroupSerialized } from "../models/entities/group";
import { User, IUser, IUserSerialized } from "../models/entities/user";
import {GroupFactory} from "../factories/group";
import { IConfig, config } from "../config";
import {ILogger, Logger} from "../util/logger";
import { UserController } from "../controllers/user";
import { IUserProvider, UserProvider } from "./user";

const logger: ILogger = Logger(path.basename(__filename));

export abstract class IGroupProvider {
  public create!: (groupData: IGroupSerialized) => Promise<IGroup>;
  public update!: (groupData: IGroupSerialized) => Promise<IGroup>;
  public getByOwnerId!: (id: number) => Promise<IGroup[]>;
  public getById!: (id: number) => Promise<IGroup | undefined>;
  public deleteById!: (id: number) => Promise<IGroup>;
}

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
    const group = await this.groupRepository.findOneById(groupData.id);
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
    return this.groupRepository.findOneById(id);
  }

  public getByOwnerId(id: number) {
    return this.groupRepository.find({"owner": id });
  }

  // delete group
  public async deleteById(id: number) {
    const group = await this.groupRepository.findOneById(id);
    if (!group) {
      throw new Error("Group does not exist");
    }
    return await this.groupRepository.remove(group);
  }

  public static serialize(group: IGroup) {
    return {
        "id": group.id,
        "name": group.name,
        "owner": group.owner,
        "users": group.users.map((u) => UserProvider.serialize(u))
      } as IGroupSerialized;
  }
}
