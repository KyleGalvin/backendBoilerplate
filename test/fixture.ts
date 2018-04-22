import {Inject} from "typescript-ioc";
import * as uuid from "uuid";

import {IUserSerialized} from "../src/models/entities/IUserSerialized";
import {UserController} from "../src/controllers/user";
import {ContactRequestController} from "../src/controllers/contactRequest";

export class Fixture {

    @Inject
    public readonly userController!: UserController;
    @Inject
    public readonly contactRequestController!: ContactRequestController;

    public generateRandomUserData() {
      return {
        "id": -1,
        "username": uuid.v4(),
        "email": uuid.v4() + "@" + uuid.v4() + "." + uuid.v4(),
        "firstName": uuid.v4(),
        "lastName": uuid.v4(),
        "password": uuid.v4(),
        "contacts": []
      } as IUserSerialized;
    }

    public generateRandomUsers(count: number) {
      return Array
        .apply(null, Array(count))
        .map((u: undefined) => this.generateRandomUserData());
    }

    public testUser1: IUserSerialized = {
      "id": -1,
      "username": "testuser1",
      "email": "email1@mail.com",
      "firstName": "jane",
      "lastName": "doe",
      "password": "",
      "contacts": []
    };

    public testUser2: IUserSerialized = {
      "id": -1,
      "username": "testuser2",
      "email": "email2@mail.com",
      "firstName": "john",
      "lastName": "doe",
      "password": "",
      "contacts": []
    };

    public modifiedTestUser: IUserSerialized = {
      "id": -1,
      "username": "testuser",
      "email": "email2@mail.com",
      "firstName": "jane2",
      "lastName": "doe2",
      "password": "",
      "contacts": []
    };

    public testUserPassword: string = "password";

}
