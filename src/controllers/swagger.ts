import * as path from "path";
import * as fs from "fs";
import * as express from "express";

import * as jwt from "express-jwt";


import { Logger } from "../util/logger";
import { IConfig } from "../config";

const logger = Logger(path.basename(__filename));

export default class Swagger {

  public router: express.Router;

  public constructor ( config: IConfig) {
    this.router = express.Router();

    this.router.get("/swagger.json",
      async (req: express.Request, res: express.Response) => {
        
        fs.readFile("./dist/swagger.json", {encoding:"utf-8"}, (err: any, data: any) => {
          logger.info({obj: err}, "swagger.json grab");
          res.json(JSON.parse(data));
        })
      }
    );
  }

}
