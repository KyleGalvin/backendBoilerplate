import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";

import {Logger} from "../../util/logger";
import {User} from "./user";
import {IUser} from "./IUser";
import {IContactRequest} from "./IContactRequest";

@Entity()
export class ContactRequest extends BaseEntity implements IContactRequest {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne((type) => User, (user: IUser) => user.id)
  public fromUser!: IUser;

  @ManyToOne((type) => User, (user: IUser) => user.id)
  public toUser!: IUser;

}
