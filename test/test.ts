import * as assert from "assert";
// https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/
import connection from "../src/models/typeorm";
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

	    //need to get this repository from a connection obj.
	    // https://github.com/typeorm/typeorm
	    connection.then((connection) => {
	    	let userRepository = connection.getRepository(User);

		    const myUser = new User();
		    myUser.username = testUser.username;
		    myUser.email = testUser.email;
		    myUser.firstName = testUser.firstName;
		    myUser.lastName = testUser.lastName;
		    assert(1===1, "working");
	    });

	    // const queriedUser = User.where("firstName", "john")
		   //  .fetch()
		   //  .then((user: User) => {
		   //  	console.log('got user: ', user);
		    	
		   //  })

	    
    }
}
