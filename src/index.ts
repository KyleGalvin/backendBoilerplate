import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as expressValidator from "express-validator";
import * as cors from "cors";

import AuthController from "./controllers/auth";
import ContactsController from "./controllers/contacts";
import GroupController from "./controllers/group";
import { config } from "./config";
import { Logger } from "./util/logger";
import Connection from "./models/typeorm";
import {User} from "./models/entities/user";
import {Group} from "./models/entities/group";

const logger = Logger(path.basename(__filename));

new Connection().init().then(connection => {
  const app = express();
  app.use(bodyParser.json({ "type": "application/json"}));
  app.use(bodyParser.urlencoded({ "extended": true }));
  app.use(cors());
  app.use(expressValidator());

  const userRepository = connection.getRepository(User);
  const groupRepository = connection.getRepository(Group);
  
  app.use(new AuthController(connection,userRepository).router);
  app.use(new GroupController(connection, config, userRepository, groupRepository).router);
  app.use(new ContactsController(connection, config).router);

  const server = http.createServer(app);
  server.listen(config.port, () => logger.info("Listening on port " + config.port));
});
