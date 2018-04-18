import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";

import { Logger } from "../../util/logger";
import { User } from "./user";

export abstract class IContactRequest {
  id!: number;
  fromUserId!: number;
  toUserId!: number;
}

@Entity()
export class ContactRequest extends BaseEntity implements IContactRequest {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne((type) => User, (user: User) => user.id)
  public fromUserId!: number;

  @ManyToOne((type) => User, (user: User) => user.id)
  public toUserId!: number;

}
