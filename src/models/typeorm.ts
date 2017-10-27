// import * as Knex from "knex";
// import * as Bookshelf from "bookshelf";
import config from "../config/local";
import {createConnection} from "typeorm";
import {User} from "./users";

let databaseConnection = createConnection({
	type: "postgres",
	url: config.connectionString,
	entities: [User]
}).then((connection) => {
	console.log('db connection established');
	return connection;
});

// const knex = Knex({
//   "client": "postgres",
//   "connection": config.connectionString
// });
// const bookshelf = Bookshelf(knex);
export default databaseConnection;
