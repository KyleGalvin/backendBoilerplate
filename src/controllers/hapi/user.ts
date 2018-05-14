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
    "options": {"auth": "jwt"},
    "handler": (request) => {
      const userController = new UserController();
      return userController.update(request.payload as IUserSerialized);
    }
  });
  server.route({
    "method": "GET",
    "path": basePath + "/{id}",
    "options": {
      "auth": "jwt",
      "tags": ["api"],
      "description": "Get User",
      "notes": "Get user by UserId"
    },
    "handler": (request) => {
      const userController = new UserController();
      return userController.read(parseInt(request.params.id, 10));
    }
  });
  server.route({
    "method": "DELETE",
    "path": basePath + "/{id}",
    "options": {
      "auth": "jwt",
      "tags": ["api"],
      "description": "Delete User",
      "notes": "Delete user by UserId"
    },
    "handler": (request) => {
      const userController = new UserController();
      return userController.delete(parseInt(request.params.id, 10));
    }
  });
  server.route({
    "method": "PUT",
    "path": basePath + "/signup",
    "options": {
      "auth": false,
      "tags": ["api"],
      "description": "Add User",
      "notes": "Add user"
    },
    "handler": (request) => {
      const userController = new UserController();
      return userController.signup(request.payload as IUserSerialized);
    }
  });
  server.route({
    "method": "PUT",
    "path": basePath + "/login",
    "options": {
      "auth": false,
      "tags": ["api"],
      "description": "Login",
      "notes": "login"
    },
    "handler": (request) => {
      const userController = new UserController();
      return userController.login(request.payload as IUserCredentials);
    }
  });
};
