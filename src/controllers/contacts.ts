import * as path from "path";
import * as express from "express";
import { Connection } from "typeorm";

import { UserProvider } from "../providers/user";
import { AuthProvider } from "../providers/auth";
import { Logger } from "../util/logger";
import { IConfig } from "../config";

const logger = Logger(path.basename(__filename));

export default class Contacts {

  public router: express.Router;
  private connection: Connection;

  public constructor(connection: Connection, config: IConfig) {
    this.router = express.Router();
    this.connection = connection;

    this.router.get("/contacts", [
      ],
      async (req: express.Request, res: express.Response) => {
        // get all groups for UID in JWT
        logger.info({"obj": req.user}, "user: ");
      }
    );

    this.router.put("/contacts/:userId", [
      ],
      async (req: express.Request, res: express.Response) => {
      }
    );
  }

}
