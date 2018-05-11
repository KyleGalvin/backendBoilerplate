import * as path from "path";
import * as fs from "fs";
import * as express from "express";
import * as Hapi from "hapi";

import {Logger} from "../util/logger";
import {IConfig} from "../config";

const logger = Logger(path.basename(__filename));

export class Swagger {

  constructor(server: Hapi.Server) {
    server.route({
      "method": "GET",
      "path": "swagger.json",
      "handler": async (request, h) => {
        return new Promise((resolve, reject) => {
          fs.readFile("./dist/swagger.json", {"encoding": "utf-8"}, (err: any, data: any) => {
            if (err) {
              reject("error reading swagger file");
            }
            resolve(JSON.parse(data));
          });
        });
      }
    });
  }
}
