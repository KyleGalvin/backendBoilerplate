import * as fs from "fs";

export default {
  "connectionString": "postgresql://sharifyr:sharifyrpassword@localhost/sharifyr",
  "httpsPort": 3000,
  "logLevel": "info",
  "jwt": {
    "secret": "secret",
    "issuer": "sharifyr",
    "duration": 86400
  },
  "sslOptions": {
    "key": fs.readFileSync("snakeoilkey.pem"),
    "cert": fs.readFileSync("snakeoilcert.pem"),
    "passphrase": "password"
  }
};
