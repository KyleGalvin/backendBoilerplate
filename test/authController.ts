import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";

import Connection from "../src/models/typeorm";
import {User, IUserSerialized} from "../src/models/user";
import {AuthProvider} from "../src/providers/auth";
import {UserProvider} from "../src/providers/user";

const testUser: IUserSerialized = {
  id: -1, 
  username: "testuser", 
  email: "email@mail.com",
  firstName: "jane",
  lastName: "doe"
};

const testUserPassword: string = "password";

@suite class AuthControllerTests {

  @test async login() {

    const connection = await Connection;

    let userProvider = new UserProvider(connection);
    let myUser = await userProvider.create(testUser, testUserPassword);

    const myAuthProvider = new AuthProvider();
    const loginResult = await myAuthProvider.login(testUser.username, testUserPassword);
    assert(loginResult, "new user can log in");

    await userProvider.delete(myUser);
  }

  @test async loginBadPassword() {

    const connection = await Connection;

    let userProvider = new UserProvider(connection);
    let myUser = await userProvider.create(testUser, testUserPassword);

    const myAuthProvider = new AuthProvider();
    const loginResult2 = await myAuthProvider.login(testUser.username, "");
    assert(!loginResult2, "new user can't login with wrong password");

    await userProvider.delete(myUser);
  }

  @test async loginBadUsername() {
    const myAuthProvider = new AuthProvider();
    const loginResult3 = await myAuthProvider.login("", testUserPassword);
    assert(!loginResult3, "bad username can't login");
  }
}