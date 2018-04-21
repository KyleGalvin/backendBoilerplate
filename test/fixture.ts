import {IUserSerialized} from "../src/models/entities/IUserSerialized";
import {UserController} from "../src/controllers/user";
import {Inject} from "typescript-ioc";

export class Fixture {

    @Inject
    public readonly userController!: UserController;

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
