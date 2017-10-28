import * as path from "path";
import "reflect-metadata";

import config from "../config/local";
import {createConnection} from "typeorm";
import {User} from "./user";
import Logger from "../util/logger";

const logger = Logger(path.basename(__filename));

let databaseConnection = createConnection({
  "type": "postgres",
  "url": config.connectionString,
  "synchronize": true,
  "entities": [User]
}).then((connection) => {
  logger.info("db connection established");
  return connection;
});

export default databaseConnection;
