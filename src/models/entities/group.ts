import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany} from "typeorm";
import * as path from "path";

import {Logger} from "../../util/logger";
import { User } from "./user";
const logger = Logger(path.normalize(path.basename(__filename)));

export interface IGroup {
  id: number;
  name: string;
  owner: number;
  save: () => void;
}

export interface IGroupSerialized {
  id: number;
  name: string;
  owner: number;
}

@Entity()
export class Group extends BaseEntity implements IGroup {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ "type": "varchar" })
  public name: string;

  @Column({ "type": "bigint" })
  public owner: number;

  @ManyToMany(type => User, (user: User) => user.groups)
  @JoinTable()
  users: User[]

}
