import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
import { Connection, Repository } from "typeorm";
import * as jwt from "express-jwt";

import { UserProvider, IUserProvider } from "../providers/user";
import { AuthProvider } from "../providers/auth";
import { Logger } from "../util/logger";
import { IConfig } from "../config";
import {User} from "../models/entities/user";
import { IGroup, Group, IGroupSerialized } from "../models/entities/group";
import { GroupProvider, IGroupProvider } from "../providers/group";
import { GroupFactory } from "../factories/group";
import { UserFactory } from "../factories/user";

const logger = Logger(path.basename(__filename));

export default class GroupController {

  public router: express.Router;
  private userRepository: Repository<User>;
  private groupRepository: Repository<Group>;
  private groupProvider: IGroupProvider;
  private userProvider: IUserProvider;

  public constructor (connection: Connection, config: IConfig, userRepository: Repository<User>, groupRepository: Repository<Group>) {
    this.router = express.Router();
    this.groupProvider = new GroupProvider(config, groupRepository, new GroupFactory());
    this.userProvider = new UserProvider(connection, new UserFactory());

    this.router.put("/group", [
      check("name", "Invalid Group Name").isLength({"min": 1}),
      jwt({secret: config.jwt.secret})
      ],
      async (req: express.Request, res: express.Response) => {
        const user = await this.userProvider.getById(req.user.userId);
        if(user) {
          //create group record
          const groupData: IGroupSerialized = {
            id: 0,
            name: req.body.name,
            owner: req.user.userId
          }
          const group = await this.groupProvider.create(groupData);
          res.status(200).json(group);
        } else {
          res.status(400);
        }
      }
    );

    this.router.get("/group", [
        jwt({secret: config.jwt.secret})
      ],
      async (req: express.Request, res: express.Response) => {
        //get user record from jwt userId
        const user = await this.userProvider.getById(req.user.userId);
        if(user) {
          res.status(200).json(user.groups)
        } else {
          res.status(400);
        }
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
        const group = await this.groupProvider.getById(req.params.groupId);
        if(group){
          (group as Group).users.push(req.params.userId);
          group.save();
        }
      }
    );
  }
}
