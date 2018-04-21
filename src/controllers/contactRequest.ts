import * as path from "path";
import {Connection} from "typeorm";
import {Post, Get, Route, Body, Request, Security, Delete, Put} from "tsoa";
import {Inject} from "typescript-ioc";

import {IContactRequest} from "../models/entities/IContactRequest";
import {IContactRequestSerialized} from "../models/entities/IContactRequestSerialized";
import {IUserProvider} from "../providers/IUserProvider";
import {IContactRequestProvider} from "../providers/IContactRequestProvider";
import {Logger} from "../util/logger";
import {IConfig} from "../config";

const logger = Logger(path.basename(__filename));

@Route("contacts")
export class ContactRequestController {

  @Inject
  private contactRequestProvider!: IContactRequestProvider;

  @Get("")
  @Security("jwt", ["user"])
  public async getContactRequests(@Request() request: Express.Request): Promise<IContactRequestSerialized[]> {
    return await this.contactRequestProvider.getContactRequests(request.user.userId);
  }

  @Put("request/{userId}")
  @Security("jwt", ["user"])
  public async sendContactRequest(@Request() request: Express.Request, userId: number): Promise<IContactRequestSerialized> {
    return await this.contactRequestProvider.sendContactRequest(request.user.userId, userId);
  }

  @Post("accept/{requestId}")
  @Security("jwt", ["user"])
  public async acceptContactRequest(requestId: number): Promise<IContactRequestSerialized> {
    return await this.contactRequestProvider.acceptContactRequest(requestId);
  }

  @Post("reject/{requestId}")
  @Security("jwt", ["user"])
  public async rejectContactRequest(requestId: number): Promise<void> {
    await this.contactRequestProvider.rejectContactRequest(requestId);
  }
}
