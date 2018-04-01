import * as bcrypt from "bcrypt";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToMany, OneToOne, JoinColumn} from "typeorm";
import * as path from "path";
import {IUser} from "../../src/models/entities/user";

export interface IUserCredentials {
  username: string;
  password: string;
}

export interface IUserSerialized extends IUserCredentials {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Entity()
export class MockUser implements IUser {

  public id!: number;
  // public resume?: Resume;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public username!: string;
  public passwordHash!: string;
  // public groups!: Group[];
  // public ownedGroups!: Group[];
  public contacts!: MockUser[];

  public verifyPassword = async (password: string) => {
    return await bcrypt.compare(password, this.passwordHash);
  }

  public updatePassword = async (password: string) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    this.passwordHash = hash;
  }

}
