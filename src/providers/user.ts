import {Repository, Connection} from "typeorm";

import {User, IUser, IUserSerialized} from "../models/user";

export class UserProvider {

  private repository: Repository<User>;

  public constructor(dbConnection: Connection) {
    this.repository = dbConnection.getRepository(User);
  }

  // create user
  public async create(userData: IUserSerialized, password: string) {

    console.log("missing validation");

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
  public update() {

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
