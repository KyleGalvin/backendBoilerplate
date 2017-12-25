import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
import { Connection } from "typeorm";
import * as jwt from "express-jwt";

import { UserProvider } from "../providers/user";
import { AuthProvider } from "../providers/auth";
import { Logger } from "../util/logger";
import { IConfig } from "../config";

const logger = Logger(path.basename(__filename));

export default class Contacts {

  public router: express.Router;
  private connection: Connection;

  public constructor (connection: Connection, config: IConfig) {
    this.router = express.Router();
    this.connection = connection;

    this.router.get("/contacts", [
      jwt({secret: config.jwt.secret})
      ],
      async (req: express.Request, res: express.Response) => {
        //get all groups for UID in JWT
        logger.info({"obj": req.user}, "user: ");
      }
    );

    this.router.put("/contacts/:userId", [
      jwt({secret: config.jwt.secret})
      ],
      async (req: express.Request, res: express.Response) => {
      }
    );
  }

}
