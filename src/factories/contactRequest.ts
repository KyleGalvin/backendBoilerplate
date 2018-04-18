import {ContactRequest} from "../models/entities/contactRequest";

export class ContactRequestFactory {
    public Create(fromUserId: number, toUserId: number): ContactRequest {
        const contactRequest = new ContactRequest();
        contactRequest.fromUserId = fromUserId;
        contactRequest.toUserId = toUserId;
        return contactRequest;
    }
}
