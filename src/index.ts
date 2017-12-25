import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as expressValidator from "express-validator";
import * as cors from "cors";

import Auth from "./controllers/auth";
import Contacts from "./controllers/contacts";
import Group from "./controllers/group";
import { config } from "./config";
import { Logger } from "./util/logger";
import Connection from "./models/typeorm";

const logger = Logger(path.basename(__filename));

new Connection().init().then(connection => {
  const app = express();
  app.use(bodyParser.json({ "type": "application/json"}));
  app.use(bodyParser.urlencoded({ "extended": true }));
  app.use(cors());
  app.use(expressValidator());
  
  app.use(new Auth(connection).router);
  app.use(new Group(connection, config).router);
  app.use(new Contacts(connection, config).router);

  const server = http.createServer(app);
  server.listen(config.port, () => logger.info("Listening on port " + config.port));
});
