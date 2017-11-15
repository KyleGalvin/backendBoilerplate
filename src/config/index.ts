import defaultConfig from "./local";

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
  "connectionString": string;
  "port": number;
  "logLevel": string;
  "jwt": IJWT;
  "sslOptions": ISSLOptions;
}

if (process.env.NODE_ENV === "DEV") {
  defaultConfig.connectionString =  process.env.DATABASE_URL as string;
  defaultConfig.port = Number(process.env.PORT as string);
}

export const config = (defaultConfig as IConfig);
