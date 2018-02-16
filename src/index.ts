import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as expressValidator from "express-validator";
import * as cors from "cors";
import {Container} from "typescript-ioc";
import {createConnection, Connection} from "typeorm";

import "./controllers/auth";
import ContactsController from "./controllers/contacts";
import GroupController from "./controllers/group";
import SwaggerController from "./controllers/swagger";
import { config } from "./config";
import { Logger } from "./util/logger";
import connectionProvider from "./models/typeorm";
import {IUserProvider, UserProvider} from "./providers/user";
import {User} from "./models/entities/user";
import {Group} from "./models/entities/group";
import {RegisterRoutes} from './routes';

const logger = Logger(path.basename(__filename));

Container.bind(Connection).provider(connectionProvider);

const app = express();
app.use(bodyParser.json({ "type": "application/json"}));
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cors());
app.use(expressValidator());

RegisterRoutes(app);
// const userRepository = await connection.getRepository(User);
// const groupRepository = await connection.getRepository(Group);

//app.use(new AuthController(connection,userRepository).router);
//app.use(new GroupController(connection, config, userRepository, groupRepository).router);
//app.use(new ContactsController(connection, config).router);
//app.use(new SwaggerController(config).router);

const server = http.createServer(app  as (req: any, res: any) => void);
server.listen(config.port, () => logger.info("Listening on port " + config.port));

