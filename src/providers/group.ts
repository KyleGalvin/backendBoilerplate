import * as path from "path";

import {Group, IGroup} from "../models/group";
import { IConfig } from "../config";
import { Repository } from "typeorm";
import {ILogger, Logger} from "../util/logger";

const logger: ILogger = Logger(path.basename(__filename));

export interface IAuthProvider {
  login: (username: string, password: string) => string;
}

export class AuthProvider {

  private config: IConfig;
  private groupRepository: Repository<Group>;

  public constructor(config: IConfig, groupRepository: Repository<Group>) {
    this.config = config;
    this.groupRepository = groupRepository;
  }

}
