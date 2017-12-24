import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
import { Connection } from "typeorm";

import { UserProvider } from "../providers/user";
import { AuthProvider } from "../providers/auth";
import { Logger } from "../util/logger";

const logger = Logger(path.basename(__filename));

export default class Contacts {

  public router: express.Router;
  private connection: Connection;

  public constructor (connection: Connection) {
    this.router = express.Router();
    this.connection = connection;

    this.router.get("/contacts",
      async (req: express.Request, res: express.Response) => {
        //get all groups for UID in JWT
      }
    );

    this.router.put("/contacts/:userId",
      async (req: express.Request, res: express.Response) => {
      }
    );
  }

}
