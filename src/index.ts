import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cors from "cors";
import {Container} from "typescript-ioc";
import {Connection} from "typeorm";
import * as Hapi from "hapi";
import * as HapiJwt from "hapi-auth-jwt2";

import IoC from "./dependencyResolution/IoC";
import "./controllers/swagger";
import "./controllers/group";
import "./controllers/contactRequest";
import "./controllers/user";

import { config } from "./config";
import { Logger } from "./util/logger";
import { ConnectionProvider } from "./models/typeorm";

const logger = Logger(path.basename(__filename));

IoC.configure();
// establish the database connection
const connection = Container.get(Connection);

const app = express();

const server = new Hapi.Server({
  "host": config.domain,
  "port": config.port
});
const start = async () => {

  try {
      await server.register(HapiJwt);
      server.auth.strategy("jwt", "jwt",
      { "key": config.jwt.secret,
        "validate": () => true,
        "verifyOptions": { "algorithms": [ "HS256" ] }
      });
      server.auth.default("jwt");
      await server.start();
  } catch (err) {
      logger.error(err);
      process.exit(1);
  }

  logger.info("Server running at:", server.info.uri);
};

start();
