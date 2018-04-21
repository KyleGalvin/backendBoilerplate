import {IGroup} from "./IGroup";

export abstract class IUser {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public username!: string;
  public contacts!: IUser[];
  public verifyPassword!: (password: string) => Promise<boolean>;
  public updatePassword!: (password: string) => Promise<void>;
  public groups!: IGroup[];
}
