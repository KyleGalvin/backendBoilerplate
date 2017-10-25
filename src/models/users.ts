import * as path from "path";
import Bookshelf from "./bookshelf";
import * as bcrypt from "bcrypt";
import Logger from "../util/logger";

const logger = Logger(path.basename(__filename));
interface IUser {
  tableName: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  verifyPassword(password: string): Promise<boolean>;

}

export class User extends Bookshelf.Model<User> implements IUser {
  public get tableName() {return 'users';}
  public get id() {return this.get('id');}
  public get firstName() {return this.get('firstName');}
  public get lastName() {return this.get('lastName');}
  public get email() {return this.get('email');}
  public get username() {return this.get('username');}
  private get passwordHash() {return this.get('passwordHash');}
  private set passwordHash(hash: string) {this.set('passwordHash', hash)}

  public verifyPassword = (password: string) => {
    let bcryptCallback = (res: boolean) => {return res;};
    return bcrypt.compare(password, this.passwordHash).then(bcryptCallback);
  };

  public updatePassword = (password: string) => {
    let bcryptCallback = (hash: string) => {this.passwordHash = hash;};
    let saltRounds = 10;
    return bcrypt.hash(password, saltRounds).then(bcryptCallback);
  };

};
