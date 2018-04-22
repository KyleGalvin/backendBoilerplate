import "reflect-metadata";
import * as path from "path";
import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";
import * as uuid from "uuid";

import {User} from "../src/models/entities/user";
import {IUser} from "../src/models/entities/IUser";
import {IUserSerialized} from "../src/models/entities/IUserSerialized";
import {UserFactory} from "../src/factories/user";
import {config} from "../src/config";
import {Logger} from "../src/util/logger";
import IoC from "../src/dependencyResolution/IoC";
import {Fixture} from "./fixture";
import {Container} from "typescript-ioc";
import {Connection} from "typeorm";
import { UserController } from "../src/controllers/user";

const logger = Logger(path.basename(__filename));
IoC.configure();
// establish the database connection
const connection = Container.get(Connection);

@suite class AuthProviderTests {

  @test public async canCreateUserAndLogin() {
    const fixture = new Fixture();

    const serializedUser = fixture.generateRandomUserData();
    const loginCredentials = await fixture.userController.signup(serializedUser);
    const myUserId = Fixture.getUserIdFromJwt(loginCredentials.authToken);
    const credentials = {
      "username": serializedUser.username,
      "password": serializedUser.password
    };

    const loginResult = await fixture.userController.login(credentials);

    const myUser = await fixture.userController.read(myUserId);

    await fixture.userController.delete(myUserId);
    assert.notEqual(loginResult, null, "new user can log in");
  }

  @test public async loginNamesMustBeUnique() {
    const fixture = new Fixture();

    const serializedUser = fixture.generateRandomUserData();
    const loginCredentials = await fixture.userController.signup(serializedUser);
    const myUserId = Fixture.getUserIdFromJwt(loginCredentials.authToken);

    try {
      await fixture.userController.signup(serializedUser);
      assert.fail("duplicate user should not be creatable");
    } catch (e) {
      assert.equal(e, "Error: User already exists");
    }

    await fixture.userController.delete(myUserId);
  }

  @test public async loginBadPassword() {
    const fixture = new Fixture();

    const serializedUser = fixture.generateRandomUserData();
    const loginCredentials = await fixture.userController.signup(serializedUser);
    const myUserId = Fixture.getUserIdFromJwt(loginCredentials.authToken);

    const credentials = {
      "username": serializedUser.username,
      "password": "notMyPassword"
    };

    try {
      const loginResult2 = await fixture.userController.login(credentials);
      assert.fail("bad password should not log in");
    } catch (e) {
      assert.equal(e, "Error: Login Error");
    }
    await fixture.userController.delete(myUserId);
  }

  @test public async loginBadUsername() {
    const fixture = new Fixture();

    const loginCredentials = await fixture.userController.signup(fixture.generateRandomUserData());
    const myUserId = Fixture.getUserIdFromJwt(loginCredentials.authToken);

    const credentials = {
      "username": "notMyUsername",
      "password": fixture.testUserPassword
    };

    try {
      const loginResult3 = await fixture.userController.login(credentials);
      assert.fail("bad username should not log in");
    } catch (e) {
      assert.equal(e, "Error: Login Error");
    }
    await fixture.userController.delete(myUserId);
  }

  @test public async canUpdateUser() {
    const fixture = new Fixture();

    const serializedUser = fixture.generateRandomUserData();
    const loginCredentials = await fixture.userController.signup(serializedUser);
    const myUserId = Fixture.getUserIdFromJwt(loginCredentials.authToken);

    const myUser = await fixture.userController.read(myUserId);

    const myUpdatedUserData: IUserSerialized = {
      ...myUser,
      ...{
        "firstName": "updatedFirstName",
        "lastName": "updatedLastName",
        "email": "updated@email.com",
        "password": "newPassword"
      }
    };

    await fixture.userController.update(myUpdatedUserData);
    const myUpdatedUser = await fixture.userController.read(myUserId);

    await fixture.userController.delete(myUserId);

    assert.notEqual(myUser.email, "updated@email.com", "updated email");
    assert.notEqual(myUser.firstName, "updatedFirstName", "updated firstName");
    assert.notEqual(myUser.lastName, "updatedLastName", "updated lastName");

  }

  @test public async canDeleteUser() {
    const fixture = new Fixture();

    const loginCredentials = await fixture.userController.signup(fixture.generateRandomUserData());
    const myUserId = Fixture.getUserIdFromJwt(loginCredentials.authToken);

    const myDeletedUser = await fixture.userController.delete(myUserId);
    try {
      const myUpdatedUser = await fixture.userController.read(myUserId);
      assert.fail("deleted user should not be able to log in");
    } catch (e) {
      assert.equal(e, "Error: User does not exist");
    }
  }
}
