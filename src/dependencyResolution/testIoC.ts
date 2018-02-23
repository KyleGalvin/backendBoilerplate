import {Container} from "typescript-ioc";
import {IAuthProvider} from "../providers/auth";
import {IGroupProvider} from "../providers/group";
import {Connection} from "typeorm";
import * as TypeMoq from "typemoq";

export default class TestIoC {
  static configure(){ 
    Container.bind(IAuthProvider).to(AuthProvider); 
    Container.bind(IGroupProvider).to(GroupProvider); 
    Container.bind(Connection).provider(ConnectionProvider);
    // ...
  }
}
