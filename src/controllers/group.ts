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

export default class Group {

  public router: express.Router;

  public constructor (connection: Connection, config: IConfig) {
    this.router = express.Router();

    this.router.put("/group", [
      check("name", "Invalid Group Name").isLength({"min": 1}),
      jwt({secret: config.jwt.secret})
      ],
      async (req: express.Request, res: express.Response) => {
        //get userId from JWT
        //create new group with name
        //return groupName/groupId object
      }
    );

    this.router.get("/group", [
        jwt({secret: config.jwt.secret})
      ],
      async (req: express.Request, res: express.Response) => {
        //get all groups for UID in JWT
      }
    );

    this.router.get("/group/:groupId",
      async (req: express.Request, res: express.Response) => {
      }
    );

    this.router.post("/group/:groupId", [
      check("name", "Invalid Group Name").isLength({"min": 1}),
      ],
      async (req: express.Request, res: express.Response) => {
        //for updating a group name
      }
    );

    this.router.delete("/group/:groupId",
      async (req: express.Request, res: express.Response) => {
      }
    );

    this.router.delete("/group/:groupId/user/:userId",
      async (req: express.Request, res: express.Response) => {
      }
    );

    this.router.put("/group/:groupId/user/:userId",
      async (req: express.Request, res: express.Response) => {
      }
    );

  }
}
