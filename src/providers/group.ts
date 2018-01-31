import * as path from "path";

import { Group, IGroup, IGroupSerialized } from "../models/entities/group";
import {GroupFactory} from "../factories/group";
import { IConfig } from "../config";
import { Repository } from "typeorm";
import {ILogger, Logger} from "../util/logger";

const logger: ILogger = Logger(path.basename(__filename));

export interface IGroupProvider {
  create: (groupData: IGroupSerialized) => Promise<IGroup>;
  update: (groupData: IGroupSerialized) => Promise<boolean>;
  getByOwnerId: (id: number) => Promise<IGroup[]>;
  getById: (id: number) => Promise<IGroup | undefined>;
}

export class GroupProvider implements IGroupProvider {

  private config: IConfig;
  private repository: Repository<Group>;
  private groupFactory: GroupFactory;

  public constructor(config: IConfig, groupRepository: Repository<Group>, groupFactory: GroupFactory) {
    this.config = config;
    this.repository = groupRepository;
    this.groupFactory = groupFactory;
  }

    public async create(groupData: IGroupSerialized) {

      logger.debug({"obj": groupData}, "Creating new group: ");
  
      const group = await this.groupFactory.Create(groupData);
  
      try {
        await this.repository.save(group);
        logger.debug("New user created");
        return group;
      } catch (e) {
        logger.info({"obj": e}, "Error saving user");
        throw new Error("Error saving user");
      }
  
    }
  
    public async update(groupData: IGroupSerialized) {
      const group = await this.repository.findOneById(groupData.id);
      if (group === undefined) {
        // can't update a record that doesn't exist.
        return false;
      }

      group.name = groupData.name;
      await this.repository.save(group);
      return true;
  
    }
  
    // get user
    public get() {
      return this.repository.find();
    }
  
    public getById(id: number) {
      return this.repository.findOneById(id);
    }

    public getByOwnerId(id: number) {
      return this.repository.find({ owner: id })
    }
  
    // delete user
    public async delete(group: Group) {
      return await this.repository.remove(group);
    }
}
