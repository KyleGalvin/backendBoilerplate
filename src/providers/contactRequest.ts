import * as path from "path";
import {Repository, Connection} from "typeorm";
import { Inject, Provides, Container } from "typescript-ioc";

import {Logger} from "../util/logger";
import {ContactRequest} from "../models/entities/contactRequest";
import {IContactRequest} from "../models/entities/IContactRequest";
import {ContactRequestFactory} from "../factories/contactRequest";
import {IUser} from "../models/entities/IUser";
import {User} from "../models/entities/user";
import {IContactRequestProvider} from "./IContactRequestProvider";

const logger = Logger(path.basename(__filename));

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
    const fromUser = await this.userRepository.findOne(fromUserId);
    const toUser = await this.userRepository.findOne(toUserId);

    if (!fromUser || !toUser) {
      throw new Error("user does not exist. cannot create contact request");
    }
    const contactRequest = this.contactRequestFactory.Create(fromUser, toUser);
    const savedContactRequest = await this.repository.save(contactRequest);
    return IContactRequestProvider.serialize(savedContactRequest);
  }

  public async acceptContactRequest(requestId: number) {
    const contactRequest = await this.repository
      .createQueryBuilder("contactRequest")
      .leftJoinAndSelect("contactRequest.fromUser", "fromUser")
      .leftJoinAndSelect("contactRequest.toUser", "toUser")
      .where("contactRequest.id = :id", {"id": requestId})
      .getOne();
    if (!contactRequest) {
      throw new Error("Contact Request not found");
    }

    const fromUser = await this.userRepository.findOne(contactRequest.fromUser);
    const toUser = await this.userRepository.findOne(contactRequest.toUser);

    if (!fromUser || !toUser) {
      throw new Error("Invalid User Id given");
    }

    fromUser.contacts = fromUser.contacts ? fromUser.contacts : [];
    toUser.contacts = toUser.contacts ? toUser.contacts : [];

    fromUser.contacts.push(toUser);
    toUser.contacts.push(fromUser);

    // no duplicates allowed
    fromUser.contacts = [...new Set(fromUser.contacts)];
    toUser.contacts = [...new Set(toUser.contacts)];

    await this.userRepository.save(fromUser);
    await this.userRepository.save(toUser);
    await this.repository.delete(contactRequest);
    return IContactRequestProvider.serialize(contactRequest);
  }

  public async rejectContactRequest(requestId: number) {
    await this.repository.delete(requestId);
  }

  public async getContactRequests(userId: number) {
    const contactRequests = await this.repository
      .createQueryBuilder("contactRequest")
      .leftJoinAndSelect("contactRequest.fromUser", "fromUser")
      .leftJoinAndSelect("contactRequest.toUser", "toUser")
      .where("(contactRequest.toUser = :id OR contactRequest.fromUser = :id)", {"id": userId})
      .getMany();
    return contactRequests.map((c) => IContactRequestProvider.serialize(c));
  }
}
