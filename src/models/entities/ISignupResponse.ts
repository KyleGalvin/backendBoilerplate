import {IUserSerialized} from "./IUserSerialized";

export interface ISignupResponse {
  authToken: string;
  user: IUserSerialized;
}
