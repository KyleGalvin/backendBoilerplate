import {IContactRequest} from "../models/entities/IContactRequest";

export abstract class IContactRequestProvider {
  public sendContactRequest!: (fromUserId: number, toUserId: number) => Promise<IContactRequest>;
  public acceptContactRequest!: (requestId: number) => Promise<IContactRequest>;
  public rejectContactRequest!: (requestId: number) => Promise<void>;
  public getContactRequests!: (userId: number) => Promise<IContactRequest[]>;
}
