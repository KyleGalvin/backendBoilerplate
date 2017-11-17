import * as path from "path";
import * as assert from "assert";
import { suite, test, slow, timeout } from "mocha-typescript";
import * as TypeMoq from "typemoq";
import {Repository, Entity, FindOneOptions, Connection, SaveOptions} from "typeorm";

//import Connection from "../src/models/typeorm";
import {IUser, User, IUserSerialized} from "../src/models/user";
import {UserFactory} from "../src/factories/user";
import {AuthProvider} from "../src/providers/auth";
import {UserProvider} from "../src/providers/user";
import {config} from "../src/config";
import {Logger} from "../src/util/logger";

const logger = Logger(path.basename(__filename));

const testUser: User = {
  id: -1, 
  username: "testuser", 
  email: "email@mail.com",
  firstName: "jane",
  lastName: "doe",
  passwordHash: "",
  hasId: () => true,
  save: () => Promise.resolve(testUser),
  remove: () => Promise.resolve(testUser),
  verifyPassword: () => new Promise((res,rej)=> res(true)),
  updatePassword: () => new Promise((res,rej)=> res())
};

const testUserPassword: string = "password";

@suite class AuthProviderTests {

  @test async canCreateUserAndLogin() {

    //this variable is our underlying mock datastore capable of holding a single record
    let testRepositoryUsers: User[] | undefined = undefined;
    let findCalls = 0;
    let saveCalls = 0;
    let getRepoCalls = 0;

    let userFactoryMock = TypeMoq.Mock.ofType<UserFactory>();
    userFactoryMock.setup((x: UserFactory) => x.Create)
      .returns(() => (userData: IUserSerialized, password: string) => Promise.resolve(testUser));
    let userFactory = userFactoryMock.object;
    
    var findOneResult = (options?: any) => {
      findCalls++;
      if(testRepositoryUsers && testRepositoryUsers.length > 0) {
        return Promise.resolve((testRepositoryUsers as User[])[0])
      } else {
        return Promise.resolve(undefined);
      }
    };
    let userRepositoryMock = TypeMoq.Mock.ofType<Repository<User>>();
    userRepositoryMock.setup((x: Repository<User>) => x.findOne)
      .returns((conditions?: any | undefined) => {
        return findOneResult;
      });

    let saveResult = (entities: User[], options?: SaveOptions | undefined) => {
      saveCalls++;
      if(!testRepositoryUsers){
        //the method signature says entities is a User[],
        //but an overload allows a single User. Check for the difference
        if(Array.isArray(entities)){
          testRepositoryUsers = new Array();
          testRepositoryUsers.concat(entities);
        } else {
          testRepositoryUsers = new Array();
          testRepositoryUsers.push(entities);
        }
      } else {
        testRepositoryUsers.concat(entities);
      }
      return Promise.resolve(testRepositoryUsers as User[])
    }
    userRepositoryMock.setup((x: Repository<User>) => x.save)
      .returns((testUsers: User[]) => {
        testRepositoryUsers = testUsers;
        return saveResult;
      });
    const userRepository = userRepositoryMock.object;

    let connectionMock = TypeMoq.Mock.ofType<Connection>();
    connectionMock.setup(x => x.getRepository(User))
      .returns((target: any) => {
        getRepoCalls++;
        return userRepository;
      });
    const connection = connectionMock.object;

    let userProvider = new UserProvider(connection, userFactory);
    assert.equal(getRepoCalls, 1, "user provider constructor called getRepo");

    let myUser = await userProvider.create(testUser, testUserPassword);
    assert.equal(findCalls, 1, "user create calls repo find");
    assert.equal(saveCalls, 1, "user create calls repo save");

    const myAuthProvider = new AuthProvider(config, userRepository);
    const loginResult = await myAuthProvider.login(myUser.username, testUserPassword);
    assert.equal(findCalls, 2, "user login calls repo find");
    assert.notEqual(loginResult, null, "new user can log in");

    await userProvider.delete(myUser);
  }
}