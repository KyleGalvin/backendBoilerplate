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

  @test public async canAddContacts() {
    const fixture = new Fixture();

    const users = fixture.generateRandomUsers(2);

    const myAccessToken1 = await fixture.userController.signup(users[0]);
    const myAccessToken2 = await fixture.userController.signup(users[1]);

    const myUserId1 = Fixture.getUserIdFromJwt(myAccessToken1.access_token);
    const myUserId2 = Fixture.getUserIdFromJwt(myAccessToken2.access_token);

    // mock the data express reads from our JWT token.
    // This is the minimum data our controller needs to recieve to act.
    const mockExpressRequest1 = {"user": {"userId": myUserId1}} as Express.Request;
    const contactRequestCreated = await fixture.contactRequestController
      .sendContactRequest(mockExpressRequest1, myUserId2);

    // get user2's pending contact requests
    const mockExpressRequest2 = {"user": {"userId": myUserId2}} as Express.Request;
    const user2ContactRequests = await fixture.contactRequestController.getContactRequests(mockExpressRequest2);

    // accept the pending request
    const acceptedRequest = await fixture.contactRequestController.acceptContactRequest(user2ContactRequests[0].id);

    // both friends should now be linked
    const myUpdatedUser1 = await fixture.userController.read(myUserId1);
    const myUpdatedUser2 = await fixture.userController.read(myUserId2);

    // cleanup should cascade to contact request table
    await fixture.userController.delete(myUserId1);
    await fixture.userController.delete(myUserId2);

    assert.notEqual(null, contactRequestCreated);
    assert.notEqual(null, contactRequestCreated.fromUser);
    assert.notEqual(null, contactRequestCreated.toUser);
    assert.equal(1, user2ContactRequests.length);
    assert.equal(contactRequestCreated.id, user2ContactRequests[0].id);
    assert.notEqual(null, acceptedRequest);
    assert.notEqual(null, acceptedRequest.fromUser);
    assert.notEqual(null, acceptedRequest.toUser);
    assert.equal(myUserId1, myUpdatedUser2.contacts[0].id);
    assert.equal(myUserId2, myUpdatedUser1.contacts[0].id);

  }

}
