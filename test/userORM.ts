import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";

import Connection from "../src/models/typeorm";
import {User, IUserSerialized} from "../src/models/user";
import {UserProvider} from "../src/providers/user";

const testUser: IUserSerialized = { 
	id: -1,
	username: "testuser", 
	email: "email@mail.com",
	firstName: "jane",
	lastName: "doe"
};

const testUserPassword: string = "password";

@suite class UserORMTests {
  @test async CRUD() {
    const connection = await Connection;

    let userProvider = new UserProvider(connection);
  	let myUser = await userProvider.create(testUser, testUserPassword);

    const user = await userProvider.getById(myUser.id);
    assert(user !== null, "userAdded");

    await userProvider.delete(myUser);

    const nullUser = await userProvider.getById(myUser.id);
    assert(nullUser === undefined, "userRemoved");

  }
}
