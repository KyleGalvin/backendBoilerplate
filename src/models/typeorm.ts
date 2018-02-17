import * as path from "path";
import "reflect-metadata";
import * as fs from "fs";
import {Provider, Provided, Provides} from "typescript-ioc";
import {createConnection, Connection} from "typeorm";

import {config} from "../config";
import {User} from "./entities/user";
import {Group} from "./entities/group";
import {Logger} from "../util/logger";

const logger = Logger(path.basename(__filename));

export const ConnectionProvider: Provider = {
  get: () => { 
    return ConnectionSingleton.getInstance(); 
  }
}

@Provides(Connection)
@Provided(ConnectionProvider)
class WrappedConnection extends Connection {
}

export class ConnectionSingleton {

  private static connection: Connection;

  public static getInstance() {
    
    if(!ConnectionSingleton.connection) {
      logger.info("Establishing database connection...");
      return createConnection({
        "type": "postgres",
        "url": config.connectionString,
        "synchronize": true,
        "entities": [User, Group]
      }).then((connection) => {
        logger.info("... Database connection established!");
        ConnectionSingleton.connection = connection
        return ConnectionSingleton.connection;
      }).catch((error) => {
        logger.error("Could not connect to database");
        throw error;
      });
    } else {
      logger.info("returning database connection");
      return Promise.resolve(ConnectionSingleton.connection);
    }

  }

  // public buildDB() {
  //   //this.connection.query(fs.readFileSync("./src/models/migration/user.sql").toString("utf-8"));
  //   this.connection.query(fs.readFileSync("./src/models/migration/group.sql").toString("utf-8"));
  // }
}
