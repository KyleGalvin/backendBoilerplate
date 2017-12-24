import * as path from "path";
import "reflect-metadata";
import * as fs from "fs";

import {config} from "../config";
import {createConnection, Connection as rawConnection} from "typeorm";
import {User} from "./entities/user";
import {Group} from "./entities/group";
import {Logger} from "../util/logger";

const logger = Logger(path.basename(__filename));

export default class Connection {

  private connection: rawConnection;

  public init() {
    const c = createConnection({
      "type": "postgres",
      "url": config.connectionString,
      "synchronize": true,
      "entities": [User, Group]
    }).then((connection) => {
      logger.debug("db connection established");
      return connection;
    }).catch((error) => {
      logger.error("Could not connect to database");
      return null;
    });
    c.then(c => this.connection = (c as rawConnection));
    return c;
  }

  public buildDB() {
    //this.connection.query(fs.readFileSync("./src/models/migration/user.sql").toString("utf-8"));
    this.connection.query(fs.readFileSync("./src/models/migration/group.sql").toString("utf-8"));
  }
}
