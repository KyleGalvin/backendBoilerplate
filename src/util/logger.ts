import * as bunyan from "bunyan";

import config from "../config/local";

export default (filename: string) => {

  type LogLevel = number | "error" | "trace" | "debug" | "info" | "warn" | "fatal" | undefined;

  return bunyan.createLogger({
    "name": filename, // Required
    "level": config.logLevel as LogLevel, // Optional, see "Levels" section
    // "streams": [
    //   {
    //     "level": "info",
    //     "stream": process.stdout
    //   },
    //   {
    //     "level": "debug",
    //     "stream": process.stdout
    //   }
    // ], // Optional, see "Streams" section
    "serializers": bunyan.stdSerializers, // Optional, see "Serializers" section
    "src": true                           // Optional, see "src" section
  });
};
