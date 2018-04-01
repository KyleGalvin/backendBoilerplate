import * as path from "path";
import {Repository, Connection} from "typeorm";
import { Inject, Provides, Container } from "typescript-ioc";

import {Logger} from "../util/logger";
// import {ConnectionProvider} from "../models/typeorm";

const logger = Logger(path.basename(__filename));

export abstract class IResumeProvider {

}

export class ResumeProvider implements IResumeProvider {

  @Inject
  private connection!: Connection;

  public constructor() {
  }

  //add resume

  //add job

  //edit resume

  //edit job

  //delete resume

  //delete job

  //get resume

  //get job

}
