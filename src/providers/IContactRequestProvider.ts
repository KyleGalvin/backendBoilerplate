import {IContactRequest} from "../models/entities/IContactRequest";
import {IContactRequestSerialized} from "../models/entities/IContactRequestSerialized";

export abstract class IContactRequestProvider {
  public sendContactRequest!: (fromUserId: number, toUserId: number) => Promise<IContactRequestSerialized>;
  public acceptContactRequest!: (requestId: number) => Promise<IContactRequestSerialized>;
  public rejectContactRequest!: (requestId: number) => Promise<void>;
  public getContactRequests!: (userId: number) => Promise<IContactRequestSerialized[]>;

  public static serialize(contactRequest: IContactRequest): IContactRequestSerialized {
    return {
        "id": contactRequest.id,
        "fromUser": contactRequest.fromUser.id,
        "toUser": contactRequest.toUser.id
      } as IContactRequestSerialized;
  }
}
