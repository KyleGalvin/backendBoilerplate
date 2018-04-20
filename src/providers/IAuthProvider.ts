export abstract class IAuthProvider {
  public login!: (username: string, password: string) => Promise<string>;
}
