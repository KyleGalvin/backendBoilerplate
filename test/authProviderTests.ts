
import "reflect-metadata";
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

    const myAccessToken = await fixture.authController.signup(serializedUser);

    const credentials = {
      username: fixture.testUser.username,
      password: fixture.testUserPassword
    }

    const loginResult = await fixture.authController.login(credentials);
    assert.notEqual(loginResult, null, "new user can log in");
  }  

  @test async loginNamesMustBeUnique() {
    let fixture = new Fixture();
    fixture.testUser.username += uuid.v4();

    const serializedUser = {
      ...fixture.testUser,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    let myAccessToken = await fixture.authController.signup(serializedUser);

    try{
      let myDuplicateAccessTokenAttempt = await fixture.authController.signup(serializedUser);
      assert.fail("duplicate user should not be creatable")
    } catch(e){
      assert.equal(e, "Error: User already exists");
    }

  }  
  
  @test async loginBadPassword() {
    console.log('starting loginBadPassword')
    let fixture = new Fixture();
    fixture.testUser.username += uuid.v4();

    const serializedUser = {
      ...fixture.testUser,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    let myAccessToken = await fixture.authController.signup(serializedUser);

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
    console.log('starting loginBadUsername')
    let fixture = new Fixture();
    fixture.testUser.username += uuid.v4();

    const credentials = {
      username: "notMyUsername",
      password: fixture.testUserPassword
    }

    const serializedUser = {
      ...fixture.testUser,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    let myAccessToken = await fixture.authController.signup(serializedUser);

    try{
      const loginResult3 = await fixture.authController.login(credentials);
      assert.fail("bad username should not log in")
    } catch(e){
      assert.equal(e, "Error: Login Error");
    }
  }

  @test async canUpdateUser() {

    let fixture = new Fixture();
    fixture.testUser.username += uuid.v4();

    const serializedUser = {
      ...fixture.testUser,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    let myAccessToken = await fixture.authController.signup(serializedUser);
    
    const myUserData = JSON.parse(Buffer.from(myAccessToken.access_token.split(".")[1], "base64").toString());
    const myUser = await fixture.userController.read(myUserData["id"]);

    const myUpdatedUserData: IUserSerialized = {
      id: myUserData["id"], 
      username: "testuser", 
      email: "email2@mail.com",
      firstName: "jane2",
      lastName: "doe2",
      password: ""
    }

    await fixture.userController.update(myUpdatedUserData);
    const myUpdatedUser = await fixture.userController.read(myUserData["id"]);

    assert.notEqual(myUser.email, myUpdatedUser.email, "updated email");
    assert.notEqual(myUser.firstName, myUpdatedUser.firstName, "updated firstName");
    assert.notEqual(myUser.lastName, myUpdatedUser.lastName, "updated lastName");

  }
}

