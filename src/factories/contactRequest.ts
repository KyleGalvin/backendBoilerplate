import {ContactRequest} from "../models/entities/contactRequest";
import {IUser} from "../models/entities/IUser";

export class ContactRequestFactory {
    public Create(fromUser: IUser, toUser: IUser): ContactRequest {
        const contactRequest = new ContactRequest();
        contactRequest.fromUser = fromUser;
        contactRequest.toUser = toUser;
        return contactRequest;
    }
}
