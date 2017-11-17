import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";
import * as TypeMoq from "typemoq";
import {Repository, Entity, FindOneOptions} from "typeorm";

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
  verifyPassword: () => new Promise((res,rej)=> res(true)),
  updatePassword: () => new Promise((res,rej)=> res())
};

const testUserPassword: string = "password";

@suite class AuthProviderTests {

  @test async canLogin() {

    const connection = await Connection;

    let userProvider = new UserProvider(connection);
    let myUser = await userProvider.create(testUser, testUserPassword);
    const findOneResult = (options?: any) => Promise.resolve(testUser);

    let userRepositoryMock = TypeMoq.Mock.ofType<Repository<IUser>>();
    userRepositoryMock.setup(x => x.findOne).returns((conditions?: {
        id?: number | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        username?: string | undefined;
        verifyPassword?: (password: string) => Promise<boolean> | undefined;
        updatePassword?: (password: string) => Promise<void> | undefined;
      } | undefined) => findOneResult);
      const userRepository = userRepositoryMock.object;

    const myAuthProvider = new AuthProvider(config, userRepository);
    const loginResult = await myAuthProvider.login(testUser.username, testUserPassword);
    assert(loginResult, "new user can log in");

    await userProvider.delete(myUser);
  }
}