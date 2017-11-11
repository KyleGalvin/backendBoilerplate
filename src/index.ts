import "reflect-metadata";
import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as https from "https";
import * as fs from "fs";
import * as expressValidator from "express-validator";

import auth from "./controllers/auth";
import diagnostics from "./controllers/diagnostics";
import config from "./config/local";
import Logger from "./util/logger";

const logger = Logger(path.basename(__filename));

const app = express();
app.use(bodyParser.json({ "type": "application/json"}));
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cors());
app.use(expressValidator());

app.use(auth);
app.use(diagnostics);

const secureServer = https.createServer(config.sslOptions, app);

secureServer.listen(config.httpsPort, () => {
  logger.info("Example app listening on port " + config.httpsPort + "!");
});
