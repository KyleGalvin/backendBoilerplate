import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToMany} from "typeorm";
import * as path from "path";

import { Logger } from "../../util/logger";
import { Job } from "./job";

const logger = Logger(path.normalize(path.basename(__filename)));

export interface IResume {

}

@Entity()
export class Resume extends BaseEntity implements IResume {
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToMany(type => Job, job => job.resumeId)
  public jobs!: Job[];

}
