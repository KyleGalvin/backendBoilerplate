import * as path from "path";
// import Bookshelf from "./bookshelf";
import * as bcrypt from "bcrypt";
import Logger from "../util/logger";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
const logger = Logger(path.basename(__filename));
interface IDBUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  verifyPassword(password: string): Promise<boolean>;
  updatePassword(password: string): Promise<void>;
}

interface IUser{
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}

// export class User extends Bookshelf.Model<User> implements IDBUser {
//   public constructor(props: IUser){
//     super();
//     this.firstName = props.firstName || "";
//     this.lastName = props.lastName || "";
//     this.email = props.email || "";
//     this.username = props.username || "";
//   }

//   public get tableName() {return 'users';}
//   // public get id() {return this.get('id');}
//   public get firstName() {return this.get('firstName');}
//   public get lastName() {return this.get('lastName');}
//   public get email() {return this.get('email');}
//   public get username() {return this.get('username');}
//   private get passwordHash() {return this.get('passwordHash');}

//   public set firstName(firstName: string) {this.set('firstName', firstName)}
//   public set lastName(lastName: string) {this.set('lastName', lastName)}
//   public set email(email: string) {this.set('email', email)}
//   public set username(username: string) {this.set('username', username)}
//   // public set id(id: number) {this.set('id', id);}
//   private set passwordHash(hash: string) {this.set('passwordHash', hash)}

//   public verifyPassword = (password: string) => {
//     let bcryptCallback = (res: boolean) => {return res;};
//     return bcrypt.compare(password, this.passwordHash).then(bcryptCallback);
//   };

//   public updatePassword = (password: string) => {
//     let bcryptCallback = (hash: string) => {this.passwordHash = hash;};
//     let saltRounds = 10;
//     return bcrypt.hash(password, saltRounds).then(bcryptCallback);
//   };

// };

@Entity()
export class User extends BaseEntity implements IDBUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

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