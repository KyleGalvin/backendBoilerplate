import * as fs from "fs";

export default {
  "connectionString": "postgresql://sharifyr:sharifyrpassword@localhost/sharifyr?ssl=true",
  "httpsPort": 3000,
  "sslOptions": {
    "key": fs.readFileSync("snakeoilkey.pem"),
    "cert": fs.readFileSync("snakeoilcert.pem"),
    "passphrase": "password"
  }
};
