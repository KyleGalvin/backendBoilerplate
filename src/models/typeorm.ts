import * as path from "path";
import "reflect-metadata";
import * as fs from "fs";
import {Provided, Provider} from "typescript-ioc";
import {createConnection, Connection as rawConnection} from "typeorm";

import {config} from "../config";
import {User} from "./entities/user";
import {Group} from "./entities/group";
import {Logger} from "../util/logger";

const logger = Logger(path.basename(__filename));

const connectionProvider: Provider = {
  get: () => new ConnectionFactory().build()
}

@Provided(connectionProvider)
class ConnectionFactory {

  public build() {
    return createConnection({
      "type": "postgres",
      "url": config.connectionString,
      "synchronize": true,
      "entities": [User, Group]
    }).then((connection) => {
      logger.debug("db connection established");
      return connection;
    }).catch((error) => {
      logger.error("Could not connect to database");
      throw error;
    });
  }

  // public buildDB() {
  //   //this.connection.query(fs.readFileSync("./src/models/migration/user.sql").toString("utf-8"));
  //   this.connection.query(fs.readFileSync("./src/models/migration/group.sql").toString("utf-8"));
  // }
}

export default connectionProvider;
