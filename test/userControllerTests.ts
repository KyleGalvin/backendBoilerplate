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
import { UserController } from "../src/controllers/user";

const logger = Logger(path.basename(__filename));
IoC.configure();
// establish the database connection
const connection = Container.get(Connection);

@suite class AuthProviderTests {

  private static getUserIdFromJwt(jwt: string) {
    const myUserData = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
    return myUserData["id"];
  }

  @test async canCreateUserAndLogin() {
    let fixture = new Fixture();

    const serializedUser = {
      ...fixture.testUser1,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    const myAccessToken = await fixture.userController.signup(serializedUser);
    const myUserId = AuthProviderTests.getUserIdFromJwt(myAccessToken.access_token);
    const credentials = {
      username: fixture.testUser1.username,
      password: fixture.testUserPassword
    }

    const loginResult = await fixture.userController.login(credentials);
    await fixture.userController.delete(myUserId);

    assert.notEqual(loginResult, null, "new user can log in");
  }  

  @test async loginNamesMustBeUnique() {
    let fixture = new Fixture();

    const serializedUser = {
      ...fixture.testUser1,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    const myAccessToken = await fixture.userController.signup(serializedUser);
    const myUserId = AuthProviderTests.getUserIdFromJwt(myAccessToken.access_token);

    try{
      await fixture.userController.signup(serializedUser);
      assert.fail("duplicate user should not be creatable")
    } catch(e){
      assert.equal(e, "Error: User already exists");
    }

    await fixture.userController.delete(myUserId);
  }  
  
  @test async loginBadPassword() {
    let fixture = new Fixture();

    const serializedUser = {
      ...fixture.testUser1,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    const myAccessToken = await fixture.userController.signup(serializedUser);
    const myUserId = AuthProviderTests.getUserIdFromJwt(myAccessToken.access_token);

    const credentials = {
      username: fixture.testUser1.username,
      password: "notMyPassword"
    };

    try{
      const loginResult2 = await fixture.userController.login(credentials);
      assert.fail("bad password should not log in")
    } catch(e){
      assert.equal(e, "Error: Login Error");
    }
    await fixture.userController.delete(myUserId);
  }

  @test async loginBadUsername() {
    let fixture = new Fixture();

    const serializedUser = {
      ...fixture.testUser1,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    const myAccessToken = await fixture.userController.signup(serializedUser);
    const myUserId = AuthProviderTests.getUserIdFromJwt(myAccessToken.access_token);

    const credentials = {
      username: "notMyUsername",
      password: fixture.testUserPassword
    };

    try{
      const loginResult3 = await fixture.userController.login(credentials);
      assert.fail("bad username should not log in")
    } catch(e){
      assert.equal(e, "Error: Login Error");
    }
    await fixture.userController.delete(myUserId);
  }

  @test async canUpdateUser() {
    let fixture = new Fixture();

    const serializedUser = {
      ...fixture.testUser1,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    const myAccessToken = await fixture.userController.signup(serializedUser);
    const myUserId = AuthProviderTests.getUserIdFromJwt(myAccessToken.access_token)
    const myUser = await fixture.userController.read(myUserId);

    const myUpdatedUserData: IUserSerialized = {
      id: myUserId, 
      username: "testuser", 
      email: "email2@mail.com",
      firstName: "jane2",
      lastName: "doe2",
      password: "",
      contacts: []
    }

    await fixture.userController.update(myUpdatedUserData);
    const myUpdatedUser = await fixture.userController.read(myUserId);

    await fixture.userController.delete(myUserId);

    assert.notEqual(myUser.email, myUpdatedUser.email, "updated email");
    assert.notEqual(myUser.firstName, myUpdatedUser.firstName, "updated firstName");
    assert.notEqual(myUser.lastName, myUpdatedUser.lastName, "updated lastName");

  }

  @test async canDeleteUser() {
    let fixture = new Fixture();

    const serializedUser = {
      ...fixture.testUser1,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized

    const myAccessToken = await fixture.userController.signup(serializedUser);
    const myUserId = AuthProviderTests.getUserIdFromJwt(myAccessToken.access_token);

    const myDeletedUser = await fixture.userController.delete(myUserId);
    try{
      const myUpdatedUser = await fixture.userController.read(myUserId);
      assert.fail("deleted user should not be able to log in")
    } catch(e){
      assert.equal(e, "Error: User does not exist");
    }
  }

  @test async canAddContacts() {
    let fixture = new Fixture();

    const serializedUser1 = {
      ...fixture.testUser1,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized
    const serializedUser2 = {
      ...fixture.testUser2,
      ...{password: fixture.testUserPassword}
      } as IUserSerialized
  
    const myAccessToken1 = await fixture.userController.signup(serializedUser1);
    const myAccessToken2 = await fixture.userController.signup(serializedUser2);

    const myUserId1 = AuthProviderTests.getUserIdFromJwt(myAccessToken1.access_token);
    const myUserId2 = AuthProviderTests.getUserIdFromJwt(myAccessToken2.access_token);

    const myUser1 = await fixture.userController.read(myUserId1);
    const myUser2 = await fixture.userController.read(myUserId2);

    //add user2 as a contact to user1's list
    const myUpdatedUser1 = {
        ...myUser1, 
        ...{
          contacts: [
            myUser2
          ]
        }
      } as IUserSerialized;
    const savedUser1 = await fixture.userController.update(myUpdatedUser1);

    await fixture.userController.delete(myUserId1);
    await fixture.userController.delete(myUserId2);

    assert.equal(myUser2.id, savedUser1.contacts[0].id);

  }
}

