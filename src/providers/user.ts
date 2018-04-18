import * as path from "path";
import {Repository, Connection} from "typeorm";
import { Inject, Provides, Container } from "typescript-ioc";

import {User, IUser, IUserSerialized} from "../models/entities/user";
import {UserFactory} from "../factories/user";
import {Logger} from "../util/logger";

const logger = Logger(path.basename(__filename));

export abstract class IUserProvider {
  public create!: (userData: IUserSerialized) => Promise<IUser>;
  public update!: (userData: IUserSerialized, password?: string) => Promise<IUser>;
  public getById!: (id: number) => Promise<User>;
  public deleteById!: (id: number) => Promise<User>;
  public static serialize: (user: IUser) => IUserSerialized;
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
    if(!userData.id)
      throw new Error("Cannot update user without an id");

    let user = await this.repository.findOneById(userData.id);
    if (user === undefined) {
      throw new Error("User does not exist");
    }

    if (userData.password && userData.password !== "") {
      await user.updatePassword(userData.password);
    }

    user.username = userData.username;
    user.email = userData.email;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.contacts = await this.resolveUpdatedContacts(user, userData.contacts);

    await this.repository.save(user);
    return await this.getById(userData.id);
  }

  private async resolveUpdatedContacts(currentUser: User, updatedUsers: IUserSerialized[]) {
    if(!currentUser.contacts)
      currentUser.contacts = [];
    if(!updatedUsers)
      updatedUsers = [];
    
    //sets force items to be unique, and gives us the handy 'has' method we can use for easy filtering
    const existingContactUsers = new Set(currentUser.contacts.map(c => c.id));
    const updatedContactUsers = new Set(updatedUsers.map(c => c.id));
    const newContactUsers = [...updatedContactUsers].filter(c => c !== undefined && !existingContactUsers.has(c as number));

    const addedFullUsers = await this.repository.findByIds(newContactUsers);
    return [
      ...currentUser.contacts.filter(c => !updatedContactUsers.has(c.id)),
      ...addedFullUsers
    ];
  }

  // get user
  public get() {
    return this.repository.find();
  }

  public async getById(id: number) {
    const user = await this.repository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.contacts", "contacts")
      .where("users.id = :id", {id: id})
      .getOne();
    
    if(!user) {
      throw new Error("User does not exist");
    }
    return user;
  }

  // delete user
  public async deleteById(id: number) {
    var user = await this.repository.findOneById(id);
    if(!user) {
      throw new Error("User does not exist");
    }
    return await this.repository.remove(user);
  }

  public static serialize(user: IUser): IUserSerialized {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        contacts: user.contacts ? user.contacts.map((c: IUser) => this.serialize(c)) : []
      } as IUserSerialized 
  }
}
