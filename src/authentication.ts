import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { IConfig, config } from "./config";

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
    if (securityName === 'jwt') {
      const token = request.body.token || request.query.token || request.headers['x-access-token'] || request.headers['authorization'];
      return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error("No token provided"))
        }
        jwt.verify(token.replace("Bearer ", ""), config.jwt.secret, function (err: any, decoded: any) {
          if (err) {
              reject(err)
          } else {
            // Check if JWT contains all required scopes
            if(scopes){
              for (let scope of scopes as string[]) {
                if (!decoded.scopes.includes(scope)) {
                  reject(new Error("JWT does not contain required scope."));
                }
              }
            }
            resolve(decoded);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        reject();
      })
    }
};
