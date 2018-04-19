import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cors from "cors";
import {Container} from "typescript-ioc";
import {Connection} from "typeorm";

import IoC from "./dependencyResolution/IoC";
import "./controllers/swagger";
import "./controllers/group";
import "./controllers/user";
import "./controllers/contactRequest";
import { config } from "./config";
import { Logger } from "./util/logger";
import { ConnectionProvider } from "./models/typeorm";
import {RegisterRoutes} from "./routes";

const logger = Logger(path.basename(__filename));

IoC.configure();
// establish the database connection
const connection = Container.get(Connection);

const app = express();
app.use(bodyParser.json({ "type": "application/json"}));
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cors());

RegisterRoutes(app);

const server = http.createServer(app  as (req: any, res: any) => void);
server.listen(config.port, () => logger.info("Listening on port " + config.port));
