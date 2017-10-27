import * as assert from "assert";
// https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/

import {User} from "../src/models/users";
import { suite, test, slow, timeout } from "mocha-typescript";

const testUser = { 
	username: "testuser", 
	email: "email@mail.com",
	firstName: "jane",
	lastName: "doe"
};

@suite class Hello {
    @test world() {
	    const UserModel = new User(testUser);
	    UserModel.save();

	    const queriedUser = User.where("firstName", "john")
		    .fetch()
		    .then((user: User) => {
		    	console.log('got user: ', user);
		    	assert(1===1, "working");
		    })
	    
    }
}
