import * as path from "path";
import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";

import {Repository, Entity, FindOneOptions, Connection, SaveOptions} from "typeorm";

import {IUser, User, IUserSerialized} from "../src/models/user";
import {UserFactory} from "../src/factories/user";
import {AuthProvider} from "../src/providers/auth";
import {UserProvider} from "../src/providers/user";
import {config} from "../src/config";
import {Logger} from "../src/util/logger";
import {Fixture} from "./fixture";

const logger = Logger(path.basename(__filename));

const testUserPassword: string = "password";

@suite class AuthProviderTests {

  @test async canCreateUserAndLogin() {

    let fixture = new Fixture();

    let userProvider = new UserProvider(fixture.connection, fixture.userFactory);
    assert.equal(fixture.getRepoCalls, 1, "user provider constructor called getRepo");

    let myUser = await userProvider.create(fixture.testUser, testUserPassword);
    assert.equal(fixture.findCalls, 1, "user create calls repo find");
    assert.equal(fixture.saveCalls, 1, "user create calls repo save");

    const myAuthProvider = new AuthProvider(config, fixture.userRepository);
    const loginResult = await myAuthProvider.login(myUser.username, testUserPassword);
    assert.equal(fixture.findCalls, 2, "user login calls repo find");
    assert.notEqual(loginResult, null, "new user can log in");

    await userProvider.delete(myUser);
  }
}