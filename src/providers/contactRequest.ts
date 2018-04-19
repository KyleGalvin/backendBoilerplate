import * as path from "path";
import {Repository, Connection} from "typeorm";
import { Inject, Provides, Container } from "typescript-ioc";

import {Logger} from "../util/logger";
import { IContactRequest, ContactRequest } from "../models/entities/contactRequest";
import {ContactRequestFactory} from "../factories/contactRequest";
import {User, IUser} from "../models/entities/user";

const logger = Logger(path.basename(__filename));

export abstract class IContactRequestProvider {
  public sendContactRequest!: (fromUserId: number, toUserId: number) => Promise<ContactRequest>;
  public acceptContactRequest!: (requestId: number) => Promise<ContactRequest>;
  public rejectContactRequest!: (requestId: number) => Promise<void>;
  public getContactRequests!: (userId: number) => Promise<ContactRequest[]>;
}

export class ContactRequestProvider implements IContactRequestProvider {

  @Inject
  private contactRequestFactory!: ContactRequestFactory;
  @Inject
  private connection!: Connection;
  private repository: Repository<ContactRequest>;
  private userRepository: Repository<User>;

  public constructor() {
    this.repository = this.connection.getRepository(ContactRequest);
    this.userRepository = this.connection.getRepository(User);
  }

  public async sendContactRequest(fromUserId: number, toUserId: number) {
    const contactRequest = this.contactRequestFactory.Create(fromUserId, toUserId);
    return await this.repository.save(contactRequest);
  }

  public async acceptContactRequest(requestId: number) {
    const contactRequest = await this.repository.findOneById(requestId);
    if (!contactRequest) {
      throw new Error("Contact Request not found");
    }

    const fromUser = await this.userRepository.findOneById(contactRequest.fromUserId);
    const toUser = await this.userRepository.findOneById(contactRequest.toUserId);

    if (!fromUser || !toUser) {
      throw new Error("Invalid User Id given");
    }

    fromUser.contacts.push(toUser);
    toUser.contacts.push(fromUser);

    // no duplicates allowed
    fromUser.contacts = [...new Set(fromUser.contacts)];
    toUser.contacts = [...new Set(toUser.contacts)];

    await this.userRepository.save(fromUser);
    await this.userRepository.save(toUser);
    return contactRequest;
  }

  public async rejectContactRequest(requestId: number) {
    await this.repository.deleteById(requestId);
  }

  public async getContactRequests(userId: number) {
    return await this.repository
      .createQueryBuilder("contactRequests")
      .where("contactRequests.toUserId = :id", {"id": userId})
      .getMany();
  }
}
