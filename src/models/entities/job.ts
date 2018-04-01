import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToMany} from "typeorm";
import * as path from "path";

import { Logger } from "../../util/logger";

const logger = Logger(path.normalize(path.basename(__filename)));

export interface IJob {

}

@Entity()
export class Job extends BaseEntity implements IJob {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ "type": "int" })
  public resumeId!: number;

  @Column({ "type": "int" })
  public companyId!: number;

  @Column({ "type": "varchar" })
  public title!: string;

  @Column({ "type": "varchar" })
  public description!: string;

}
