import {IUser} from "./IUser";

export interface IGroup {
  id: number;
  name: string;
  owner: number;
  users: IUser[];
}
