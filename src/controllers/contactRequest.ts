import * as path from "path";
import {Connection} from "typeorm";
import {Inject} from "typescript-ioc";
import * as Hapi from "hapi";

import {IContactRequest} from "../models/entities/IContactRequest";
import {IContactRequestSerialized} from "../models/entities/IContactRequestSerialized";
import {IUserProvider} from "../providers/IUserProvider";
import {IContactRequestProvider} from "../providers/IContactRequestProvider";
import {Logger} from "../util/logger";
import {IConfig} from "../config";

const logger = Logger(path.basename(__filename));

export class ContactRequestController {

  @Inject
  private contactRequestProvider!: IContactRequestProvider;

  constructor(server: Hapi.Server) {
    server.route({
      "method": "GET",
      "path": "",
      "handler": async (request, h) => {
        return await this.contactRequestProvider.getContactRequests(request.user.userId);
      }
    });
    server.route({
      "method": "PUT",
      "path": "request/{userId}",
      "handler": async (request, h) => {
        logger.info("hapi auth: " + request.headers.authorization);
        return await this.contactRequestProvider
          .sendContactRequest(request.user.userId, parseInt(request.params.userId, 10));
      }
    });
    server.route({
      "method": "POST",
      "path": "accept/{requestId}",
      "handler": async (request, h) => {
        return await this.contactRequestProvider.acceptContactRequest(parseInt(request.params.requestId, 10));
      }
    });
    server.route({
      "method": "POST",
      "path": "reject/{requestId}",
      "handler": async (request, h) => {
        await this.contactRequestProvider.rejectContactRequest(parseInt(request.params.requestId, 10));
      }
    });
  }
}
