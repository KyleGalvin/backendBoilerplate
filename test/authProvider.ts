import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";
import * as TypeMoq from "typemoq";
import {IRepository, Entity, FindOneOptions} from "typeorm";

import Connection from "../src/models/typeorm";
import {IUser, User, IUserSerialized} from "../src/models/user";
import {AuthProvider} from "../src/providers/auth";
import {UserProvider} from "../src/providers/user";
import {config} from "../src/config";


const testUser: IUser = {
  id: -1, 
  username: "testuser", 
  email: "email@mail.com",
  firstName: "jane",
  lastName: "doe",
  verifyPassword: () => new Promise((res,rej)=> res(false)),
  updatePassword: () => new Promise((res,rej)=> res())
};

const testUserPassword: string = "password";

@suite class AuthProviderTests {

  @test async login() {

    const connection = await Connection;

    let userProvider = new UserProvider(connection);
    let myUser = await userProvider.create(testUser, testUserPassword);
    const findOneResult = (options?: any) => Promise.resolve(testUser);

    let userRepositoryMock = TypeMoq.Mock.ofType<IRepository<IUser>>();
    userRepositoryMock.setup(x => x.findOne).returns(() => findOneResult);
    const userRepository = userRepositoryMock.object;

    const myAuthProvider = new AuthProvider(config, userRepository);
    const loginResult = await myAuthProvider.login(testUser.username, testUserPassword);
    assert(loginResult, "new user can log in");

    await userProvider.delete(myUser);
  }
}