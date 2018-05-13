import * as Hapi from "hapi";

import jwtToId from "../../util/jwt";
import { UserController } from "../User";
import {IUserSerialized} from "../../models/entities/IUserSerialized";
import {IUserCredentials} from "../../models/entities/user";

export default (server: Hapi.Server) => {

  const basePath = "/user";

  server.route({
    "method": "POST",
    "path": basePath + "",
    "handler": (request) => {
      const userController = new UserController();
      userController.update(request.payload as IUserSerialized);
    }
  });
  server.route({
    "method": "GET",
    "path": basePath + "/{id}",
    "handler": (request) => {
      const userController = new UserController();
      userController.read(parseInt(request.params.id, 10));
    }
  });
  server.route({
    "method": "DELETE",
    "path": basePath + "/{id}",
    "handler": (request) => {
      const userController = new UserController();
      userController.delete(parseInt(request.params.id, 10));
    }
  });
  server.route({
    "method": "PUT",
    "path": basePath + "/signup",
    "handler": (request) => {
      const userController = new UserController();
      userController.signup(request.payload as IUserSerialized);
    }
  });
  server.route({
    "method": "PUT",
    "path": basePath + "/login",
    "handler": (request) => {
      const userController = new UserController();
      userController.login(request.payload as IUserCredentials);
    }
  });
};
