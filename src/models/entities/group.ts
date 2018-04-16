import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany} from "typeorm";
import * as path from "path";

import {Logger} from "../../util/logger";
import { User, IUserSerialized } from "./user";
const logger = Logger(path.normalize(path.basename(__filename)));

export interface IGroup {
  id: number;
  name: string;
  owner: number;
  users: User[];
}

export interface IGroupSerialized {
  id: number;
  name: string;
  owner: number;
  users: IUserSerialized[];
}

@Entity()
export class Group extends BaseEntity implements IGroup {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ "type": "varchar" })
  public name!: string;

  @Column({ "type": "bigint" })
  public owner!: number;

  @ManyToMany((type) => User, (user: User) => user.groups)
  @JoinTable()
  public users!: User[];

}
