import * as path from "path";
import {Inject} from "typescript-ioc";
import * as Hapi from "hapi";

import {Logger} from "../util/logger";
import {IConfig, config} from "../config";
import {Group, IGroupSerialized} from "../models/entities/group";
import {IGroup} from "../models/entities/IGroup";
import {IUserProvider} from "../providers/IUserProvider";
import {IGroupProvider} from "../providers/IGroupProvider";

const logger = Logger(path.basename(__filename));

export class GroupController {

  @Inject
  private groupProvider!: IGroupProvider;
  @Inject
  private userProvider!: IUserProvider;

  constructor(server: Hapi.Server){
    server.route({
      "method": "POST",
      "path": "",
      "handler": async (request, h) => {
        const updatedGroup = await this.groupProvider.update(request.payload as IGroupSerialized);
        return IGroupProvider.serialize(updatedGroup);
      }
    });
    server.route({
      "method": "PUT",
      "path": "",
      "handler": async (request, h) => {
        const group = request.payload as IGroupSerialized;
        const user = await this.userProvider.getById(request.user.userId);
        if (user) {
          // create group record
          const groupData: IGroupSerialized = {
            "id": 0,
            "name": group.name,
            "owner": request.user.userId,
            "users": group.users
          };
          const savedGroup = await this.groupProvider.create(groupData);
          return IGroupProvider.serialize(savedGroup);
        } else {
          throw new Error("Not authenticated");
        }
      }
    });
    server.route({
      "method": "GET",
      "path": "",
      "handler": async (request, h) => {
        // get user record from jwt userId
        const user = await this.userProvider.getById(request.user.userId);
        if (user) {
          return user.groups.map((g) => IGroupProvider.serialize(g));
        } else {
          throw new Error("Not authenticated");
        }
      }
    });
    server.route({
      "method": "DELETE",
      "path": "/{id}",
      "handler": async (request, h) => {
        await this.groupProvider.deleteById(parseInt(request.params.id, 10));
      }
    });
  }
}
