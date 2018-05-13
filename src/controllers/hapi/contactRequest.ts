import * as Hapi from "hapi";

import jwtToId from "../../util/jwt";
import { UserController } from "../user";
import {IUserSerialized} from "../../models/entities/IUserSerialized";
import { ContactRequestController } from "../contactRequest";

export default (server: Hapi.Server) => {

  const basePath = "/contactRequests";

  server.route({
    "method": "GET",
    "path": basePath + "",
    "handler": (request) => {
      const contactRequestController = new ContactRequestController();
      const userId = jwtToId(request.headers.authorization);
      contactRequestController.getContactRequests(userId);
    }
  });
  server.route({
    "method": "PUT",
    "path": basePath + "/request/{userId}",
    "handler": (request) => {
      const contactRequestController = new ContactRequestController();
      const fromUserId = jwtToId(request.headers.authorization);
      const toUserId = parseInt(request.params.userId, 10);
      contactRequestController.sendContactRequest(fromUserId, toUserId);
    }
  });
  server.route({
    "method": "POST",
    "path": basePath + "/accept/{requestId}",
    "handler": (request) => {
      const contactRequestController = new ContactRequestController();
      contactRequestController.acceptContactRequest(parseInt(request.params.requestId, 10));
    }
  });
  server.route({
    "method": "POST",
    "path": basePath + "/reject/{requestId}",
    "handler": (request) => {
      const contactRequestController = new ContactRequestController();
      contactRequestController.rejectContactRequest(parseInt(request.params.requestId, 10));
    }
  });
};
