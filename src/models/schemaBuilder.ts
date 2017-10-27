// import * as Knex from "knex";
// import Bookshelf from "./bookshelf";

// export function deleteSchema() {
//   return Bookshelf.knex.schema.dropTableIfExists("users");
// }

// export function buildSchema() {
//   Bookshelf.knex.schema.createTable("users", (t: Knex.CreateTableBuilder) => {
//     t.increments("id");
//     t.string("firstName");
//     t.string("lastName");
//     t.string("email");
//     t.string("username");
//     t.string("passwordHash");
//     t.timestamps();
//   }).then(() => {
//     // ...
//     // you now have a users table with a few columns.
//   });
// }
