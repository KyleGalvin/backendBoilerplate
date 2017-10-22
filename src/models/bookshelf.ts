import * as Knex from "knex";
import * as Bookshelf from "bookshelf";
import config from "../config/local";

const knex = Knex({
  "client": "postgres",
  "connection": config.connectionString
});
const bookshelf = Bookshelf(knex);
export default bookshelf;
