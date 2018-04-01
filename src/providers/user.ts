import * as path from "path";
import {Repository, Connection} from "typeorm";
import { Inject, Provides, Container } from "typescript-ioc";

import {User, IUser, IUserSerialized} from "../models/entities/user";
import {UserFactory} from "../factories/user";
import {Logger} from "../util/logger";
// import {ConnectionProvider} from "../models/typeorm";

const logger = Logger(path.basename(__filename));

export abstract class IUserProvider {
  public create!: (userData: IUserSerialized) => Promise<User>;
  public update!: (userData: IUserSerialized, password?: string) => Promise<boolean>;
  public getById!: (id: number) => Promise<User | undefined>;
}

export class UserProvider implements IUserProvider {

  @Inject
  private userFactory!: UserFactory;
  @Inject
  private connection!: Connection;
  private repository: Repository<User>;

  public constructor() {
    this.repository = this.connection.getRepository(User);
  }

  // create user
  public async create(userData: IUserSerialized) {
    const existingUser = await this.repository.findOne({"username": userData.username});
    if (existingUser) {
      logger.warn({"obj": [userData.username, existingUser]}, "Error: user already exists: ");
      throw new Error("User already exists");
    }

    const user = await this.userFactory.Create(userData);

    try {
      await this.repository.save(user);
      return user;
    } catch (e) {
      throw new Error("Error saving user");
    }

  }

  // update user
  public async update(userData: IUserSerialized) {
    const user = await this.repository.findOneById(userData.id);
    if (user === undefined) {
      // can't update a record that doesn't exist.
      return false;
    }

    if (userData.password && userData.password !== "") {
      await user.updatePassword(userData.password);
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
