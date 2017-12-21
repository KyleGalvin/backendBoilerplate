import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";

import {UserProvider} from "../providers/user";
import {AuthProvider} from "../providers/auth";
import {Logger} from "../util/logger";
import Connection from "../models/typeorm";

const logger = Logger(path.basename(__filename));

const router = express.Router();
router.put("/group", [
  check("name", "Invalid Group Name").isLength({"min": 1}),
  ],
  async (req: express.Request, res: express.Response) => {
    //get userId from JWT
    //create new group with name
    //return groupName/groupId object
  }
);

router.get("/group",
  async (req: express.Request, res: express.Response) => {
    //get all groups for UID in JWT
  }
);

router.get("/group/:groupId",
  async (req: express.Request, res: express.Response) => {
  }
);

router.post("/group/:groupId", [
  check("name", "Invalid Group Name").isLength({"min": 1}),
  ],
  async (req: express.Request, res: express.Response) => {
    //for updating a group name
  }
);

router.delete("/group/:groupId",
  async (req: express.Request, res: express.Response) => {
  }
);

router.delete("/group/:groupId/user/:userId",
  async (req: express.Request, res: express.Response) => {
  }
);

router.put("/group/:groupId/user/:userId",
  async (req: express.Request, res: express.Response) => {
  }
);

export default router;
