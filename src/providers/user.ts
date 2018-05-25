import * as path from "path";
import {Repository, Connection, SelectQueryBuilder} from "typeorm";
import { Inject, Provides, Container } from "typescript-ioc";

import {User} from "../models/entities/user";
import {IUserSerialized} from "../models/entities/IUserSerialized";
import {IUser} from "../models/entities/IUser";
import {UserFactory} from "../factories/user";
import {Logger} from "../util/logger";
import {IUserProvider} from "./IUserProvider";

const logger = Logger(path.basename(__filename));

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

  public async getFiltered(filters: any) {

    const processList = (list: string[], builder: SelectQueryBuilder<User>): SelectQueryBuilder<User> => {
      if (list.length === 0) {
        return builder;
      } else {
        // recursively consume list elements until it is empty, chaining 'andWhere' queries for each
        const head = list.shift() as string; // not undefined since if statement exists early
        const queryObj: any = {};
        const v = filters[head];
        queryObj[head] = v;
        const filterString = "user." + head + " = :" + head;
        const newBuilder = builder.andWhere(filterString , queryObj);
        return processList(list, newBuilder);
      }
    };

    const queryBuilder = this.repository
      .createQueryBuilder("user")
      .where("1=1");

    return processList(Object.keys(filters), queryBuilder).getMany();
  }

  // update user
  public async update(userData: IUserSerialized) {
    if (!userData.id) {
      throw new Error("Cannot update user without an id");
    }

    const user = await this.repository.findOne(userData.id);
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
    if (userData.contacts) {
      user.contacts = await this.resolveUpdatedContacts(user, userData.contacts);
    }

    await this.repository.save(user);
    return await this.getById(userData.id);
  }

  private async resolveUpdatedContacts(currentUser: IUser, updatedUsers: IUserSerialized[]) {
    if (!currentUser.contacts) {
      currentUser.contacts = [];
    }
    if (!updatedUsers) {
      updatedUsers = [];
    }

    // sets force items to be unique, and gives us the handy 'has' method we can use for easy filtering
    const existingContactUsers = new Set(currentUser.contacts.map((c) => c.id));
    const updatedContactUsers = new Set(updatedUsers.map((c) => c.id));
    const newContactUsers = [...updatedContactUsers]
      .filter((c) => c !== undefined && !existingContactUsers.has(c as number));

    const addedFullUsers = await this.repository.findByIds(newContactUsers);
    return [
      ...currentUser.contacts.filter((c) => !updatedContactUsers.has(c.id)),
      ...addedFullUsers
    ];
  }

  public async getById(id: number) {
    const user = await this.repository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.contacts", "contacts")
      .where("users.id = :id", {"id": id})
      .getOne();

    if (!user) {
      throw new Error("User does not exist");
    }
    if (!user.contacts) {
      user.contacts = [];
    }
    return user;
  }

  // delete user
  public async deleteById(id: number) {
    return await this.repository.delete(id);
  }
}
