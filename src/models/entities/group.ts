import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany} from "typeorm";
import * as path from "path";

import {Logger} from "../../util/logger";
import {IUser} from "./IUser";
import {User} from "./user";
import {IGroup} from "./IGroup";
import {IUserSerialized} from "./IUserSerialized";

const logger = Logger(path.normalize(path.basename(__filename)));

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

  @ManyToMany((type) => User, (user: IUser) => user.groups)
  @JoinTable()
  public users!: IUser[];

}
