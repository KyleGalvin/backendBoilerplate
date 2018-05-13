import * as path from "path";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cors from "cors";
import {Container} from "typescript-ioc";
import {Connection} from "typeorm";
import * as Hapi from "hapi";
import * as HapiJwt from "hapi-auth-jwt2";

import IoC from "./dependencyResolution/IoC";
// import "./controllers/swagger";
import registerGroup from "./controllers/hapi/group";
import registerContactRequests from "./controllers/hapi/contactRequest";
import registerUsers from "./controllers/hapi/user";
import { config } from "./config";
import { Logger } from "./util/logger";
import { ConnectionProvider } from "./models/typeorm";

const logger = Logger(path.basename(__filename));

IoC.configure();
// establish the database connection
const connection = Container.get(Connection);

const start = async () => {

  try {
    const server = new Hapi.Server({
      "host": config.domain,
      "port": config.port,
      "routes": {
        "cors": {
          "origin": [
            "http://localhost"
          ]
        }
      }
    });

    await server.register(HapiJwt);

    registerGroup(server);
    registerContactRequests(server);
    registerUsers(server);

    server.auth.strategy("jwt", "jwt",
    { "key": config.jwt.secret,
      "validate": () => true,
      "verifyOptions": { "algorithms": [ "HS256" ] }
    });
    server.auth.default("jwt");
    await server.start();
    logger.info("Server running at:", server.info.uri);
  } catch (err) {
      logger.error(err);
      process.exit(1);
  }
};

start();
