import {IUserSerialized} from "../src/models/entities/user";
import {UserController} from "../src/controllers/user";
import {Inject} from "typescript-ioc";

export class Fixture {

    @Inject
    public readonly userController!: UserController;

    public testUser: IUserSerialized = {
      id: -1, 
      username: "testuser", 
      email: "email@mail.com",
      firstName: "jane",
      lastName: "doe",
      password: ""
    };

    public modifiedTestUser: IUserSerialized = {
      id: -1, 
      username: "testuser", 
      email: "email2@mail.com",
      firstName: "jane2",
      lastName: "doe2",
      password: ""
    };

    public testUserPassword: string = "password";

}

