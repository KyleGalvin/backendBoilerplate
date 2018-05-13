import * as Hapi from "hapi";

import jwtToId from "../../util/jwt";
import { GroupController } from "../group";
import {IGroupSerialized} from "../../models/entities/group";

export default (server: Hapi.Server) => {

  const basePath = "/group";

  server.route({
    "method": "POST",
    "path": basePath + "",
    "handler": async (request, h) => {
      const groupController = new GroupController();
      return await groupController.update(request.payload as IGroupSerialized);
    }
  });
  server.route({
    "method": "PUT",
    "path":  basePath + "",
    "handler": async (request, h) => {
      const groupController = new GroupController();
      const group = request.payload as IGroupSerialized;
      const userId = jwtToId(request.headers.authorization);
      groupController.saveGroup(userId, group);
    }
  });
  server.route({
    "method": "GET",
    "path": basePath + "",
    "handler": async (request, h) => {
      const groupController = new GroupController();
      const userId = jwtToId(request.headers.authorization);
      return await groupController.getGroups(userId);
    }
  });
  server.route({
    "method": "DELETE",
    "path": basePath + "/{id}",
    "handler": async (request, h) => {
      const groupController = new GroupController();
      groupController.deleteById(parseInt(request.params.id, 10));
    }
  });
};
