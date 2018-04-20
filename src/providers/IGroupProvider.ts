import {DeleteResult} from "typeorm";

import {IGroupSerialized} from "../models/entities/group";
import {IGroup} from "../models/entities/IGroup";
import {IUserProvider} from "./IUserProvider";

export abstract class IGroupProvider {
  public create!: (groupData: IGroupSerialized) => Promise<IGroup>;
  public update!: (groupData: IGroupSerialized) => Promise<IGroup>;
  public getByOwnerId!: (id: number) => Promise<IGroup[]>;
  public getById!: (id: number) => Promise<IGroup | undefined>;
  public deleteById!: (id: number) => Promise<DeleteResult>;

  public static serialize(group: IGroup) {
    return {
        "id": group.id,
        "name": group.name,
        "owner": group.owner,
        "users": group.users.map((u) => IUserProvider.serialize(u))
      } as IGroupSerialized;
  }
}
