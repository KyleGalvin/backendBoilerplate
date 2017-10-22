import * as bunyan from "bunyan";

export default (filename: string) => {
  return bunyan.createLogger({
    "name": filename, // Required
    "level": "info", // Optional, see "Levels" section
    "streams": [
      {
        "level": "info",
        "stream": process.stdout
      }
    ], // Optional, see "Streams" section
    "serializers": bunyan.stdSerializers, // Optional, see "Serializers" section
    "src": true                           // Optional, see "src" section
  });
};
