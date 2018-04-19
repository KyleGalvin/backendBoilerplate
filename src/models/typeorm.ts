import * as path from "path";
import "reflect-metadata";
import * as fs from "fs";
import {Provider, Provided, Provides} from "typescript-ioc";
import {createConnection, Connection, ConnectionOptions} from "typeorm";

import {config} from "../config";
import {User} from "./entities/user";
import {Group} from "./entities/group";
import {Logger} from "../util/logger";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";

const logger = Logger(path.basename(__filename));

export const ConnectionProvider: Provider = {
  "get": () => {
    return ConnectionSingleton.getInstance();
  }
};

@Provides(Connection)
@Provided(ConnectionProvider)
class WrappedConnection extends Connection {
}

export class ConnectionSingleton {

  private static connection: Connection;

  public static getInstance() {
    if (!ConnectionSingleton.connection) {
      logger.info("Establishing database connection. Driver: " + config.database);
      let connectionData: ConnectionOptions;

      if (config.database === "sqljs") {
        connectionData = {
          "type": "sqljs",
          "synchronize": true,
          "entities": [User, Group]
        };
      } else {
        connectionData = {
          "type": "postgres",
          "url" : config.connectionString,
          "synchronize": true,
          "entities": [User, Group]
        };
      }
      return createConnection(connectionData).then((connection) => {
        logger.info("... Database connection established!");
        ConnectionSingleton.connection = connection;
        return ConnectionSingleton.connection;
      }).catch((error) => {
        logger.error("Could not connect to database");
        throw error;
      });
    } else {
      logger.debug("returning database connection");
      return ConnectionSingleton.connection;
    }
  }

}
