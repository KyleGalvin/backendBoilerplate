import * as path from "path";
import * as fs from "fs";
import * as express from "express";
import {Get, Post, Put, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Security } from "tsoa";
import { Logger } from "../util/logger";
import { IConfig } from "../config";

const logger = Logger(path.basename(__filename));

@Route("")
export class Swagger {

  @Security("jwt",["user"])
  @Get("swagger.json")
  public async getSwagger(): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile("./dist/swagger.json", {encoding:"utf-8"}, (err: any, data: any) => {
        logger.info({obj: err}, "swagger.json grab");
        if(err){
          reject("error reading swagger file");
        }
        resolve(JSON.parse(data));
      })
    })
  }
}
