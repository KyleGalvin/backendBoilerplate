import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cors from "cors";
import {Container} from "typescript-ioc";
import {Connection} from "typeorm";

import RuntimeIoC from "./dependencyResolution/runtimeIoC";
import "./controllers/auth";
import "./controllers/swagger";
// import ContactsController from "./controllers/contacts";
import "./controllers/group";
import { config } from "./config";
import { Logger } from "./util/logger";
import { ConnectionProvider } from "./models/typeorm";
// import {IUserProvider, UserProvider} from "./providers/user";
// import {User} from "./models/entities/user";
// import {Group} from "./models/entities/group";
import {RegisterRoutes} from "./routes";

const logger = Logger(path.basename(__filename));

RuntimeIoC.configure();
// establish the database connection
const connection = Container.get(Connection);

const app = express();
app.use(bodyParser.json({ "type": "application/json"}));
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cors());

RegisterRoutes(app);
// const userRepository = await connection.getRepository(User);
// const groupRepository = await connection.getRepository(Group);

// app.use(new AuthController(connection,userRepository).router);
// app.use(new ContactsController(connection, config).router);

const server = http.createServer(app  as (req: any, res: any) => void);
server.listen(config.port, () => logger.info("Listening on port " + config.port));
