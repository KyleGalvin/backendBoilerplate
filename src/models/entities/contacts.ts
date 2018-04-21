import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import * as path from "path";

import {Logger} from "../../util/logger";
import {User} from "./user";
import {IUser} from "./IUser";

const logger = Logger(path.normalize(path.basename(__filename)));

export interface IGroup {
  id: number;
  name: string;
}

@Entity()
export class Group extends BaseEntity implements IGroup {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ "type": "varchar" })
  public name!: string;

  @ManyToMany((type) => User, (user: IUser) => user.groups)
  @JoinTable()
  public users!: IUser[];

}
