import * as assert from "assert";
// https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/
import Connection from "../src/models/typeorm";
import {User} from "../src/models/user";
import { suite, test, slow, timeout } from "mocha-typescript";

const testUser = { 
	username: "testuser", 
	email: "email@mail.com",
	firstName: "jane",
	lastName: "doe",
	password: "password"
};

@suite class UserORMTests {
    @test async CRUD() {

	    let connection  = await Connection;
    	let userRepository = connection.getRepository(User);

	    const myUser = new User();
	    myUser.username = testUser.username;
	    myUser.email = testUser.email;
	    myUser.firstName = testUser.firstName;
	    myUser.lastName = testUser.lastName;
	    let result = await myUser.updatePassword(testUser.password);

	    await userRepository.save(myUser);

	    const allUsers = await userRepository.find();
	    assert(allUsers.length == 1, "userAdded");

	    await userRepository.remove(myUser);

	    const noUsers = await userRepository.find();
	    assert(noUsers.length == 0, "userRemoved");

    }
}
