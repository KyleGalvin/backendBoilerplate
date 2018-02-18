import * as path from "path";
import {Inject} from "typescript-ioc";
import {Get, Put, Route, Body, Query, Header, Request, Security } from "tsoa";

import { Logger } from "../util/logger";
import { IConfig, config } from "../config";
import { IGroup, Group, IGroupSerialized } from "../models/entities/group";
import { UserProvider, IUserProvider } from "../providers/user";
import { GroupProvider, IGroupProvider } from "../providers/group";

const logger = Logger(path.basename(__filename));

@Route("group")
export class GroupController {

  @Inject
  private groupProvider!: IGroupProvider;
  @Inject
  private userProvider!: IUserProvider;

  @Put("")
  @Security("jwt", ["user"])
  public async putGroup(@Request() request: Express.Request, @Body() name: string): Promise<IGroup> {
    const user = await this.userProvider.getById(request.user.userId);
    if (user) {
      // create group record
      const groupData: IGroupSerialized = {
        "id": 0,
        "name": name,
        "owner": request.user.userId
      };
      return await this.groupProvider.create(groupData);
    } else {
      throw new Error("Not authenticated");
    }
  }

  @Get("")
  public async getGroups(@Request() request: Express.Request): Promise<IGroup[]> {
    // get user record from jwt userId
    const user = await this.userProvider.getById(request.user.userId);
    if (user) {
      return user.groups;
    } else {
      throw new Error("Not authenticated");
    }
  }

  //   this.router.get("/group/:groupId",
  //     async (req: express.Request, res: express.Response) => {
  //     }
  //   );

  //   this.router.post("/group/:groupId", [
  //     check("name", "Invalid Group Name").isLength({"min": 1}),
  //     ],
  //     async (req: express.Request, res: express.Response) => {
  //       //for updating a group name
  //     }
  //   );

  //   this.router.delete("/group/:groupId",
  //     async (req: express.Request, res: express.Response) => {
  //     }
  //   );

  //   this.router.delete("/group/:groupId/user/:userId",
  //     async (req: express.Request, res: express.Response) => {
  //     }
  //   );

  //   this.router.put("/group/:groupId/user/:userId",
  //     async (req: express.Request, res: express.Response) => {
  //       const group = await this.groupProvider.getById(req.params.groupId);
  //       if(group){
  //         (group as Group).users.push(req.params.userId);
  //         group.save();
  //       }
  //     }
  //   );

}
