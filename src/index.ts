import "reflect-metadata";
import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as expressValidator from "express-validator";

import auth from "./controllers/auth";
import diagnostics from "./controllers/diagnostics";
import {config} from "./config";
import {Logger} from "./util/logger";

const logger = Logger(path.basename(__filename));

logger.info("Running in environment " + process.env.NODE_ENV);

const app = express();
app.use(bodyParser.json({ "type": "application/json"}));
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cors());
app.use(expressValidator());

app.use(auth);
app.use(diagnostics);

if (process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "PROD") {
  logger.info("Heroku launching HTTP");
  // heroku does its own ssl
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Strict-Transport-Security", "max-age=8640000; includeSubDomains");
    if (req.headers["x-forwarded-proto"] && req.headers["x-forwarded-proto"] === "http") {
      return res.redirect(301, "https://" + req.hostname + req.url);
    } else {
      return next();
    }
  });

  const server = http.createServer(app);
  server.listen(config.port, () => {
    logger.info("Example app listening on port " + config.port);
  });

} else {
  logger.info("Local launching HTTPS");
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Strict-Transport-Security", "max-age=8640000; includeSubDomains");
    if (!req.secure) {
      logger.info("localhost redirect to https://" + req.hostname  + ":" + config.port + req.url);
      return res.redirect(301, "https://" + req.hostname  + ":" + config.port + req.url);
    } else {
      logger.info("localhost secure");
      return next();
    }
  });

  const server = https.createServer(config.sslOptions, app);
  server.listen(config.port, () => {
    logger.info("Example app listening on port " + config.port);
  });
}


