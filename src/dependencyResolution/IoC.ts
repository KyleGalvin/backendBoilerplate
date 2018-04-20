import {Container} from "typescript-ioc";
import {AuthProvider} from "../providers/auth";
import {IAuthProvider} from "../providers/IAuthProvider";
import {GroupProvider} from "../providers/group";
import {IGroupProvider} from "../providers/IGroupProvider";
import {UserProvider} from "../providers/user";
import {IUserProvider} from "../providers/IUserProvider";
import {ContactRequestProvider} from "../providers/contactRequest";
import {IContactRequestProvider} from "../providers/IContactRequestProvider";
import {Connection} from "typeorm";
import {ConnectionProvider} from "../models/typeorm";

export default class RuntimeIoC {
  public static configure() {
    Container.bind(IAuthProvider).to(AuthProvider);
    Container.bind(IUserProvider).to(UserProvider);
    Container.bind(IGroupProvider).to(GroupProvider);
    Container.bind(IContactRequestProvider).to(ContactRequestProvider);
    Container.bind(Connection).provider(ConnectionProvider);
    // ...
  }
}
