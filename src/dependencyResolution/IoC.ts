import {Container} from "typescript-ioc";
import {IAuthProvider, AuthProvider} from "../providers/auth";
import {IGroupProvider, GroupProvider} from "../providers/group";
import {IUserProvider, UserProvider} from "../providers/user";
import {Connection} from "typeorm";
import {ConnectionProvider} from "../models/typeorm";

export default class RuntimeIoC {
  static configure(){ 
    Container.bind(IAuthProvider).to(AuthProvider); 
    Container.bind(IUserProvider).to(UserProvider); 
    Container.bind(IGroupProvider).to(GroupProvider); 
    Container.bind(Connection).provider(ConnectionProvider);
    // ...
  }
}
