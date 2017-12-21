import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany} from "typeorm";
import * as path from "path";

import {Logger} from "../util/logger";
import { User } from "./user";
const logger = Logger(path.normalize(path.basename(__filename)));

export interface IGroup {
  id: number;
  name: string;
}

@Entity()
export class Group extends BaseEntity implements IGroup {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ "type": "varchar" })
  public name: string;

  @ManyToMany(type => User, (user: User) => user.groups)
  users: User[]

}
