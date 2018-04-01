
import * as path from "path";
import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";
import * as uuid from "uuid";

import {IUser, User, IUserSerialized} from "../src/models/entities/user";
import {UserFactory} from "../src/factories/user";
import {config} from "../src/config";
import {Logger} from "../src/util/logger";
import IoC from "../src/dependencyResolution/IoC";
import {Fixture} from "./fixture";
import {Container} from "typescript-ioc";
import {Connection} from "typeorm";

const logger = Logger(path.basename(__filename));
IoC.configure();
// establish the database connection
const connection = Container.get(Connection);

@suite class AuthProviderTests {

  @test async canCreateUserAndLogin() {
    let fixture = new Fixture();
    fixture.testUser.username += uuid.v4();

    const serializedUser = {
      ...fixture.testUser,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    let myUser = await fixture.authController.signup(serializedUser);

    const credentials = {
      username: fixture.testUser.username,
      password: fixture.testUserPassword
    }

    const loginResult = await fixture.authController.login(credentials);
    assert.notEqual(loginResult, null, "new user can log in");
  }  

  // @test async canUpdateUser() {

  //   let fixture = new Fixture();
  //   fixture.testUser.username += uuid.v4();

  //   let myUser = await fixture.authController.signup({
  //     ...{password: fixture.testUserPassword},
  //     ...fixture.testUser} as IUserSerialized);

  //   // myUser.username = fixture.modifiedTestUser.username;
  //   // myUser.email = fixture.modifiedTestUser.email;
  //   // myUser.firstName = fixture.modifiedTestUser.firstName;
  //   // myUser.lastName = fixture.modifiedTestUser.lastName;

  //   await fixture.userProvider.update({...{"password": ""},...myUser} as IUserSerialized);

  //   let myUpdatedUser = (await fixture.userProvider.getById(myUser.id)) as User;

  //   assert.equal(-1,myUpdatedUser.id);

  //   assert.equal(fixture.modifiedTestUser.username, myUpdatedUser.username, "updated username");
  //   assert.equal(fixture.modifiedTestUser.email, myUpdatedUser.email, "updated email");
  //   assert.equal(fixture.modifiedTestUser.firstName, myUpdatedUser.firstName, "updated firstName");
  //   assert.equal(fixture.modifiedTestUser.lastName, myUpdatedUser.lastName, "updated lastName");

  //   await fixture.userProvider.delete(myUpdatedUser);
  // }
  
  @test async loginBadPassword() {
    let fixture = new Fixture();
    fixture.testUser.username += uuid.v4();

    let myUser = await fixture.authController.signup({
      ...{password: fixture.testUserPassword},
      ...fixture.testUser} as IUserSerialized);

    const credentials = {
      username: fixture.testUser.username,
      password: "notMyPassword"
    }

    try{
      const loginResult2 = await fixture.authController.login(credentials);
      assert.fail("bad password should not log in")
    } catch(e){
      assert.equal(e, "Error: Login Error");
    }
  }

  @test async loginBadUsername() {
    let fixture = new Fixture();
    fixture.testUser.username += uuid.v4();

    const credentials = {
      username: "notMyUsername",
      password: fixture.testUserPassword
    }

    try{
      const loginResult3 = await fixture.authController.login(credentials);
      assert.fail("bad username should not log in")
    } catch(e){
      assert.equal(e, "Error: Login Error");
    }
  }
}

