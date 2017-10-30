import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  verifyPassword(password: string): Promise<boolean>;
  updatePassword(password: string): Promise<void>;
}

export interface IUserSerialized {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ "type": "varchar" })
  public firstName: string;

  @Column({ "type": "varchar" })
  public lastName: string;

  @Column({ "type": "varchar" })
  public email: string;

  @Column({ "type": "varchar" })
  public username: string;

  @Column({ "type": "varchar" })
  public passwordHash: string;

  public verifyPassword = async (password: string) => {
    return await bcrypt.compare(password, this.passwordHash);
  }

  public updatePassword = async (password: string) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    this.passwordHash = hash;
  }

}
