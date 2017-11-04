import * as path from "path";
import {Repository, Connection} from "typeorm";

import {User, IUser, IUserSerialized} from "../models/user";
import Logger from "../util/logger";

const logger = Logger(path.basename(__filename));

export class UserProvider {

  private repository: Repository<User>;

  public constructor(dbConnection: Connection) {
    this.repository = dbConnection.getRepository(User);
  }

  // create user
  public async create(userData: IUserSerialized, password: string) {

    const existingUser = await this.repository.findOne({"username": userData.username});
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User();
    user.username = userData.username;
    user.email = userData.email;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    await user.updatePassword(password);

    await this.repository.save(user);
    return user;
  }

  // update user
  public async update(userData: IUserSerialized, password?: string) {
    const user = await this.repository.findOneById(userData.id);
    if (user === undefined) {
      // can't update a record that doesn't exist.
      return false;
    }

    if (password) {
      await user.updatePassword(password);
    }

    user.username = userData.username;
    user.email = userData.email;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    await this.repository.save(user);
    return true;

  }

  // get user
  public get() {
    return this.repository.find();
  }

  public getById(id: number) {
    return this.repository.findOneById(id);
  }

  // delete user
  public async delete(user: User) {
    return await this.repository.remove(user);
  }

}
