import {DeleteResult} from "typeorm";

import {IUser} from "../models/entities/IUser";
import {IUserSerialized} from "../models/entities/IUserSerialized";

export abstract class IUserProvider {
  public create!: (userData: IUserSerialized) => Promise<IUser>;
  public update!: (userData: IUserSerialized, password?: string) => Promise<IUser>;
  public getById!: (id: number) => Promise<IUser>;
  public deleteById!: (id: number) => Promise<DeleteResult>;
  public static serialize(user: IUser): IUserSerialized {
    return {
        "id": user.id,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "username": user.username,
        "contacts": user.contacts ? user.contacts.map((c: IUser) => this.serialize(c)) : []
      } as IUserSerialized;
  }
}
