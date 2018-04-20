export abstract class IUserSerialized {
  public id?: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public contacts!: IUserSerialized[];
}
