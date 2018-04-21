import {IUser} from "./IUser";

export abstract class IContactRequest {
  public id!: number;
  public fromUser!: IUser;
  public toUser!: IUser;
}
