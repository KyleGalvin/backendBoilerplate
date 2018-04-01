import defaultConfig from "./local";
import testConfig from "./test";
import {ConnectionOptions} from "typeorm";

export interface IJWT {
  "secret": string;
  "issuer": string;
  "duration": number;
}

export interface ISSLOptions {
  "key": string;
  "cert": string;
  "passphrase": string;
}

export interface IConfig {
  "domain": string;
  "database": "mysql" | "mariadb" | "postgres" | "sqlite" | "mssql" | "oracle" | "websql" | "cordova" | "sqljs" | "mongodb";
  "connectionString": string;
  "port": number;
  "logLevel": string;
  "jwt": IJWT;
  "sslOptions": ISSLOptions;
}

const env = (process.env.NODE_ENV as string).trim();
if (env === "DEV") {
  defaultConfig.connectionString =  process.env.DATABASE_URL as string;
  defaultConfig.port = Number(process.env.PORT as string);
}

if (env === "TEST") {
  defaultConfig.database = testConfig.database;
  defaultConfig.logLevel = testConfig.logLevel;
}

export const config = (defaultConfig as IConfig);
